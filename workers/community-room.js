// Internal Durable Object Worker. The default export has no public room route.
const reply = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
})

export class CommunityRoom {
  constructor(ctx) { this.ctx = ctx }

  async openState() {
    const shutdown = await this.ctx.storage.get('shutdown') === true
    const leaseUntil = Number(await this.ctx.storage.get('leaseUntil') ?? 0)
    return { open: !shutdown && leaseUntil > Date.now(), shutdown, leaseUntil }
  }

  broadcast(payload) {
    const message = JSON.stringify(payload)
    for (const socket of this.ctx.getWebSockets()) {
      try { socket.send(message) } catch { /* disconnected client */ }
    }
  }

  async fetch(request) {
    const path = new URL(request.url).pathname
    if (path === '/state' && request.method === 'GET') return reply(await this.openState())
    if (path === '/socket' && request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const pair = new globalThis.WebSocketPair()
      const [client, server] = Object.values(pair)
      this.ctx.acceptWebSocket(server)
      server.send(JSON.stringify({ type: 'status', ...(await this.openState()) }))
      return new Response(null, { status: 101, webSocket: client })
    }
    if (request.method !== 'POST') return reply({ error: 'Not found.' }, 404)
    if (path === '/heartbeat') {
      if (await this.ctx.storage.get('shutdown')) return reply({ error: 'Room is shut down.' }, 409)
      const leaseUntil = Date.now() + 90_000
      await this.ctx.storage.put('leaseUntil', leaseUntil)
      await this.ctx.storage.setAlarm(leaseUntil)
      this.broadcast({ type: 'status', open: true })
      return reply({ open: true, leaseUntil })
    }
    if (path === '/close' || path === '/shutdown') {
      await this.ctx.storage.put('leaseUntil', 0)
      if (path === '/shutdown') await this.ctx.storage.put('shutdown', true)
      this.broadcast({ type: 'status', open: false, shutdown: path === '/shutdown' })
      return reply({ open: false })
    }
    if (path === '/enable') {
      await this.ctx.storage.put('shutdown', false)
      return reply({ open: false, shutdown: false })
    }
    if (path === '/publish') {
      const state = await this.openState()
      if (!state.open) return reply({ error: 'Room is read-only.' }, 409)
      const post = await request.json().catch(() => null)
      if (!post || typeof post.id !== 'string') return reply({ error: 'Invalid approved post.' }, 400)
      // The room sends only a notification. Each member fetches approved text
      // through the authenticated D1 endpoint, which applies their block list.
      this.broadcast({ type: 'post-available', id: post.id })
      return reply({ ok: true })
    }
    return reply({ error: 'Not found.' }, 404)
  }

  async alarm() {
    const state = await this.openState()
    if (!state.open) {
      this.broadcast({ type: 'status', open: false, shutdown: state.shutdown })
      return
    }
    await this.ctx.storage.setAlarm(state.leaseUntil)
  }

  webSocketMessage(socket) {
    // Posts are accepted only by the authenticated Pages Function queue.
    socket.send(JSON.stringify({ type: 'notice', message: 'Use the moderated post form.' }))
  }

  webSocketClose(socket, code, reason) { socket.close(code, reason) }
}

export default { fetch() { return reply({ error: 'Not found.' }, 404) } }
