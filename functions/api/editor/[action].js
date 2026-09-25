import { handleEditorialRequest } from '../../lib/editorial.js'

export async function onRequest({ request, env, params }) {
  return handleEditorialRequest(request, env, params.action)
}
