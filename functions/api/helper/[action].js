import { handleHelperRequest } from '../../lib/helper.js'

export async function onRequest({ request, env, params }) {
  return handleHelperRequest(request, env, params.action)
}
