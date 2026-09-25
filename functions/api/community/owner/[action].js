import { handleCommunityOwnerRequest } from '../../../lib/communityOwner.js'

export async function onRequest({ request, env, params }) {
  return handleCommunityOwnerRequest(request, env, params.action)
}
