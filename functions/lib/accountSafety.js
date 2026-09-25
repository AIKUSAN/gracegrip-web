import { FOCUS_IDS } from '../../src/content/focusAreas.js'
import { normalizeProgress, PRACTICE_EMBLEMS } from '../../src/utils/progress.js'

export const MAX_ACCOUNT_BODY = 64 * 1024

export function validateSyncPayload(payload) {
  if (!payload || payload.confirmSync !== true || !Number.isInteger(payload.baseRevision) || payload.baseRevision < 0) return null
  if (!Array.isArray(payload.selectedFocusIds) || payload.selectedFocusIds.length > FOCUS_IDS.size) return null
  const selectedFocusIds = [...new Set(payload.selectedFocusIds)]
  if (selectedFocusIds.length !== payload.selectedFocusIds.length || selectedFocusIds.some((id) => !FOCUS_IDS.has(id))) return null
  if (!Array.isArray(payload.goals) || !Array.isArray(payload.goalCheckins) || !Array.isArray(payload.emblems)) return null
  if (payload.goals.length > 7 || payload.goalCheckins.length > 3650 || payload.emblems.length > 100) return null
  const selected = new Set(selectedFocusIds)
  const normalized = normalizeProgress(payload)
  const goals = normalized.goals.filter((goal) => selected.has(goal.focusId))
  const goalIds = new Set(goals.map((goal) => goal.focusId))
  const goalCheckins = normalized.goalCheckins.filter((entry) => goalIds.has(entry.focusId))
  const emblems = normalized.emblems.filter((id) => PRACTICE_EMBLEMS.includes(id) || (id.startsWith('days:') && goalIds.has(id.split(':')[2])))
  return { selectedFocusIds, goals, goalCheckins, emblems }
}

export async function readJsonLimited(request, limit = MAX_ACCOUNT_BODY) {
  if (!request.body) return null
  const reader = request.body.getReader()
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) { await reader.cancel(); return null }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  try { return JSON.parse(new TextDecoder().decode(bytes)) } catch { return null }
}
