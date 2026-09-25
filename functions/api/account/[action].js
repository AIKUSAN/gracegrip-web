import { handleAccountRequest } from '../../lib/account.js'

export async function onRequest({ request, env, params }) {
  return handleAccountRequest(request, env, params.action)
}
