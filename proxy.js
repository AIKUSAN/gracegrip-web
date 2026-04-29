/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { NextResponse } from 'next/server'

export default function proxy(request) {
  const rawHost = request.headers.get('host') || request.nextUrl.hostname
  const requestHost = rawHost.split(':')[0].toLowerCase()

  if (requestHost === 'www.gracegrip.app') {
    const canonicalUrl = new URL(request.url)
    canonicalUrl.hostname = 'gracegrip.app'
    return Response.redirect(canonicalUrl, 301)
  }

  return NextResponse.next()
}
