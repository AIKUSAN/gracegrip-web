/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { buildLlmsFullTxt } from '@/lib/discoveryMetadata'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
