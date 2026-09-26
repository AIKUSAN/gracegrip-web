'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/utils/storage'

const FIELDS = [
  ['intention', 'What change do you want to try?'],
  ['trigger', 'What situation or feeling tends to come first?'],
  ['nextStep', 'What is one small step you can take?'],
  ['support', 'Who or what could support you?'],
]

function GoalPlanForm({ area, goal, onSaveGoalPlan }) {
  const [plan, setPlan] = useState(goal.plan ?? {})
  const [saved, setSaved] = useState(false)
  return <form className="cc-goal-plan" onSubmit={(event) => {
    event.preventDefault()
    onSaveGoalPlan(area.id, plan)
    setSaved(true)
  }}>
    <h3>Your next-step plan</h3>
    <p>Write only what you want to keep on this device. You can leave any field blank.</p>
    {FIELDS.map(([key, label]) => <label key={key}>{label}<textarea value={plan[key] ?? ''} maxLength={300} rows={2} onChange={(event) => { setSaved(false); setPlan((current) => ({ ...current, [key]: event.target.value })) }} /></label>)}
    <button type="submit" className="cc-action">Save my plan</button>
    {saved && <span role="status">Saved on this device.</span>}
  </form>
}

export function GoalChoice({ area }) {
  const { appState, onStartGoal, onGoalCheckin, onSaveGoalPlan, onRemoveGoal } = useApp()
  const [trackDays, setTrackDays] = useState(false)
  const goal = appState.goals?.find((item) => item.focusId === area.id)
  const today = formatDate(new Date())
  const todayEntry = appState.goalCheckins?.find((item) => item.focusId === area.id && item.date === today)

  return <section className="cc-goal-box">
    <h2>Your private goal</h2>
    {!goal ? <>
      <p>Set a personal intention for this topic. It stays on this device and is never inferred from your earlier streak.</p>
      {area.dayMilestones && <label className="cc-check-label"><input type="checkbox" checked={trackDays} onChange={(event) => setTrackDays(event.target.checked)} /> Mark consecutive days toward this goal. I can turn this off by removing the goal.</label>}
      <button type="button" className="cc-action" onClick={() => onStartGoal(area.id, trackDays)}>Start a private goal</button>
    </> : <>
      <p>Started {goal.startedAt}. Your goal and check-ins stay on this device unless you explicitly choose a later sync option.</p>
      <GoalPlanForm area={area} goal={goal} onSaveGoalPlan={onSaveGoalPlan} />
      <h3>Today&apos;s reflection</h3>
      <p>What feels true today? Either answer can lead to a helpful next step.</p>
      <div className="cc-goal-actions"><button type="button" onClick={() => onGoalCheckin(area.id, 'step')} aria-pressed={todayEntry?.status === 'step'}>I took a helpful step</button><button type="button" onClick={() => onGoalCheckin(area.id, 'setback')} aria-pressed={todayEntry?.status === 'setback'}>I had a setback</button></div>
      {todayEntry && <p role="status">Today is recorded privately. You can change this choice today.</p>}
      <button type="button" className="cc-remove-goal" onClick={() => { if (window.confirm('Remove this goal, plan, and check-ins from this device? Earned emblems will remain.')) onRemoveGoal(area.id) }}>Remove this goal and check-ins</button>
    </>}
  </section>
}
