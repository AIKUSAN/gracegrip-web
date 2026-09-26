'use client'

import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { getFocusArea } from '@/content/focusAreas'
import { BotanicalEmblem } from '@/components/BotanicalEmblem'

const milestoneLabel = (id) => {
  if (id.startsWith('days:')) { const [, days, focus] = id.split(':'); return `${days} days · ${getFocusArea(focus)?.title ?? 'Goal'}` }
  return ({ grounding: 'Grounding practice', 'first-puzzle': 'First puzzle session', 'seven-devotionals': 'Seven devotional days', 'return-after-setback': 'Returned after a setback' })[id] ?? id
}

export function ProgressPage() {
  const { appState } = useApp()
  const goals = appState.goals ?? []
  const checkins = appState.goalCheckins ?? []
  const emblems = appState.emblems ?? []
  const days = Array.from({ length: 14 }, (_, offset) => { const date = new Date(); date.setDate(date.getDate() - (13 - offset)); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` })
  return <div className="cc-page cc-progress">
    <header className="cc-intro"><h1>Your private progress</h1><p>These notes describe actions you chose to record. They are stored on this device; an older GraceGrip streak stays separate as legacy progress.</p></header>
    {goals.length === 0 ? <section className="cc-note"><h2>Begin where you are</h2><p>You have not created a new focus goal. Your earlier GraceGrip history is preserved.</p><Link href="/focus">Choose a focus</Link></section> : goals.map((goal) => {
      const area = getFocusArea(goal.focusId)
      const ownCheckins = checkins.filter((entry) => entry.focusId === goal.focusId)
      return <section className="cc-progress-goal" key={goal.focusId}><div><h2>{area?.title ?? 'Your goal'}</h2><p>Started {goal.startedAt} · {ownCheckins.length} recorded check-ins</p><Link href={`/focus/${goal.focusId}`}>Open this path</Link></div><div className="cc-chart" role="img" aria-label={`${area?.title ?? 'Goal'} activity over the last 14 days: ${ownCheckins.filter((entry) => days.includes(entry.date)).length} recorded days`}>
        {days.map((day) => { const entry = ownCheckins.find((item) => item.date === day); return <span key={day} className={`cc-chart-day${entry ? ` cc-chart-${entry.status}` : ''}`} title={`${day}: ${entry ? entry.status : 'no entry'}`} /> })}
      </div><p className="cc-chart-key">Each mark is one date. Teal means a helpful step; outlined means a setback; empty means no entry. Missing days are not failures.</p></section>
    })}
    <section className="cc-emblems"><h2>Emblems you have earned</h2>{emblems.length ? <ul>{emblems.map((id) => <li key={id}><BotanicalEmblem kind={id.startsWith('days:') ? 'flower' : 'branch'} className="cc-emblem-art" />{milestoneLabel(id)}</li>)}</ul> : <p>No emblems yet. Practices and selected day goals can earn permanent emblems.</p>}</section>
    {appState.streak?.longest > 0 && <section className="cc-legacy"><h2>Legacy progress</h2><p>Your previous GraceGrip streak history is kept in your existing backup and has not been assigned to a new goal.</p><p>Longest prior streak: {appState.streak.longest} days</p></section>}
  </div>
}
