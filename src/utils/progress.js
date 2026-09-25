import { FOCUS_IDS } from '../content/focusAreas.js'

export const DAY_MILESTONES = [1, 3, 7, 14, 21, 30, 60, 90, 180, 365]
export const PRACTICE_EMBLEMS = ['grounding', 'first-puzzle', 'seven-devotionals', 'return-after-setback']

const validDay = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const safeNote = (value) => typeof value === 'string' ? value.trim().slice(0, 300) : ''

const normalizePlan = (plan) => ({
  intention: safeNote(plan?.intention),
  trigger: safeNote(plan?.trigger),
  nextStep: safeNote(plan?.nextStep),
  support: safeNote(plan?.support),
})

export function normalizeProgress(candidate = {}) {
  const goals = Array.isArray(candidate.goals) ? candidate.goals.filter((goal) => goal && FOCUS_IDS.has(goal.focusId) && validDay(goal.startedAt)).map((goal) => ({ focusId: goal.focusId, startedAt: goal.startedAt, trackDays: goal.trackDays === true, plan: normalizePlan(goal.plan) })) : []
  const uniqueGoals = [...new Map(goals.map((goal) => [goal.focusId, goal])).values()]
  const goalCheckins = Array.isArray(candidate.goalCheckins) ? candidate.goalCheckins.filter((entry) => entry && FOCUS_IDS.has(entry.focusId) && validDay(entry.date) && ['step', 'setback'].includes(entry.status)).map(({ focusId, date, status }) => ({ focusId, date, status })) : []
  const uniqueCheckins = [...new Map(goalCheckins.map((entry) => [`${entry.focusId}:${entry.date}`, entry])).values()]
  const emblems = Array.isArray(candidate.emblems) ? [...new Set(candidate.emblems.filter((value) => typeof value === 'string' && (PRACTICE_EMBLEMS.includes(value) || /^days:(?:1|3|7|14|21|30|60|90|180|365):[a-z-]+$/.test(value))))] : []
  const puzzleBest = Number.isInteger(candidate.puzzleBest) && candidate.puzzleBest >= 0 ? candidate.puzzleBest : 0
  return { goals: uniqueGoals, goalCheckins: uniqueCheckins, emblems, puzzleBest }
}

export function startGoal(state, focusId, trackDays, date) {
  if (!FOCUS_IDS.has(focusId) || !validDay(date)) return state
  const progress = normalizeProgress(state)
  if (progress.goals.some((goal) => goal.focusId === focusId)) return state
  return { ...state, goals: [...progress.goals, { focusId, startedAt: date, trackDays: trackDays === true, plan: normalizePlan() }] }
}

export function saveGoalPlan(state, focusId, plan) {
  const progress = normalizeProgress(state)
  if (!progress.goals.some((goal) => goal.focusId === focusId)) return state
  return { ...state, goals: progress.goals.map((goal) => goal.focusId === focusId ? { ...goal, plan: normalizePlan(plan) } : goal) }
}

export function removeGoal(state, focusId) {
  const progress = normalizeProgress(state)
  return {
    ...state,
    goals: progress.goals.filter((goal) => goal.focusId !== focusId),
    goalCheckins: progress.goalCheckins.filter((entry) => entry.focusId !== focusId),
  }
}

export function recordGoalCheckin(state, focusId, status, date) {
  if (!validDay(date) || !['step', 'setback'].includes(status)) return state
  const progress = normalizeProgress(state)
  const goal = progress.goals.find((item) => item.focusId === focusId)
  if (!goal) return state
  const hadSetback = progress.goalCheckins.some((entry) => entry.focusId === focusId && entry.status === 'setback' && entry.date < date)
  const goalCheckins = [...progress.goalCheckins.filter((entry) => entry.focusId !== focusId || entry.date !== date), { focusId, date, status }]
  const emblems = [...progress.emblems]
  if (hadSetback && status === 'step' && !emblems.includes('return-after-setback')) emblems.push('return-after-setback')
  if (goal.trackDays && status === 'step') {
    let count = 0
    let cursor = new Date(`${date}T00:00:00Z`)
    const completed = new Set(goalCheckins.filter((entry) => entry.focusId === focusId && entry.status === 'step').map((entry) => entry.date))
    while (completed.has(cursor.toISOString().slice(0, 10)) && count <= 365) { count += 1; cursor.setUTCDate(cursor.getUTCDate() - 1) }
    for (const milestone of DAY_MILESTONES) if (count >= milestone && !emblems.includes(`days:${milestone}:${focusId}`)) emblems.push(`days:${milestone}:${focusId}`)
  }
  return { ...state, goalCheckins, emblems }
}

export function awardPracticeEmblem(state, emblem) {
  if (!PRACTICE_EMBLEMS.includes(emblem)) return state
  const progress = normalizeProgress(state)
  return progress.emblems.includes(emblem) ? state : { ...state, emblems: [...progress.emblems, emblem] }
}
