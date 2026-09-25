import { handleCommunityRequest } from '../../lib/community.js'

export async function onRequest({ request, env, params }) {
  return handleCommunityRequest(request, env, params.action)
}
