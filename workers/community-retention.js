// Run once per day with separate account and community D1 bindings.
// No message, report, or recovery-code content is logged.
export async function runCommunityRetention(env, at = new Date()) {
  if (!env.COMMUNITY_DB || !env.ACCOUNT_DB) throw new Error('Retention bindings are missing')
  const cutoff = at.toISOString()
  const olderThan30Days = new Date(at.getTime() - 30 * 86_400_000).toISOString()
  await env.COMMUNITY_DB.prepare('DELETE FROM posts WHERE expires_at <= ?').bind(cutoff).run()
  await env.COMMUNITY_DB.prepare('DELETE FROM incident_evidence WHERE expires_at <= ?').bind(cutoff).run()
  await env.COMMUNITY_DB.prepare('DELETE FROM alias_requests WHERE status != ? AND created_at <= ?').bind('pending', olderThan30Days).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM auth_challenges WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM auth_rate WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM email_tokens WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM email_quota WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM ai_daily_quota WHERE expires_at <= ?').bind(cutoff).run()
  await env.ACCOUNT_DB.prepare('DELETE FROM ai_response_reports WHERE created_at <= ?').bind(new Date(at.getTime() - 90 * 86_400_000).toISOString()).run()
}

export default {
  scheduled(_event, env, ctx) {
    ctx.waitUntil(runCommunityRetention(env))
  },
}
