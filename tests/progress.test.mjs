import assert from 'node:assert/strict'
import { test } from 'node:test'
import { awardPracticeEmblem, recordGoalCheckin, removeGoal, saveGoalPlan, startGoal } from '../src/utils/progress.js'

test('new goals are explicit and isolated from a legacy streak', () => {
  const oldState = { streak: { count: 20, lastCheckIn: '2026-09-25', longest: 20 }, goals: [], goalCheckins: [], emblems: [] }
  const next = startGoal(oldState, 'nicotine', true, '2026-09-25')
  assert.equal(next.streak.count, 20)
  assert.equal(next.goals[0].focusId, 'nicotine')
  assert.equal(next.goals[0].trackDays, true)
  assert.deepEqual(next.goals[0].plan, { intention: '', trigger: '', nextStep: '', support: '' })
  assert.deepEqual(next.emblems, [])
})

test('goal plan is bounded and removing a goal clears notes and check-ins but keeps earned emblems', () => {
  let state = startGoal({ goals: [], goalCheckins: [], emblems: ['grounding'] }, 'nicotine', true, '2026-09-25')
  state = saveGoalPlan(state, 'nicotine', { intention: '  Try one change  ', trigger: 'a'.repeat(400) })
  assert.equal(state.goals[0].plan.intention, 'Try one change')
  assert.equal(state.goals[0].plan.trigger.length, 300)
  state = recordGoalCheckin(state, 'nicotine', 'step', '2026-09-25')
  state = removeGoal(state, 'nicotine')
  assert.deepEqual(state.goals, [])
  assert.deepEqual(state.goalCheckins, [])
  assert.ok(state.emblems.includes('grounding'))
})

test('invalid calendar dates cannot create goals', () => {
  const state = { goals: [], goalCheckins: [], emblems: [] }
  assert.equal(startGoal(state, 'nicotine', true, '2026-02-31'), state)
})

test('day emblems persist after a setback and return can earn a practice emblem', () => {
  let state = startGoal({ goals: [], goalCheckins: [], emblems: [] }, 'nicotine', true, '2026-09-20')
  state = recordGoalCheckin(state, 'nicotine', 'step', '2026-09-20')
  state = recordGoalCheckin(state, 'nicotine', 'step', '2026-09-21')
  state = recordGoalCheckin(state, 'nicotine', 'step', '2026-09-22')
  assert.ok(state.emblems.includes('days:3:nicotine'))
  state = recordGoalCheckin(state, 'nicotine', 'setback', '2026-09-23')
  state = recordGoalCheckin(state, 'nicotine', 'step', '2026-09-24')
  assert.ok(state.emblems.includes('days:3:nicotine'))
  assert.ok(state.emblems.includes('return-after-setback'))
})

test('gambling path does not award day emblems and practice emblems are independent', () => {
  let state = startGoal({ goals: [], goalCheckins: [], emblems: [] }, 'gambling', false, '2026-09-25')
  state = recordGoalCheckin(state, 'gambling', 'step', '2026-09-25')
  state = awardPracticeEmblem(state, 'grounding')
  assert.deepEqual(state.emblems, ['grounding'])
})
