/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, BookMarked, HeartHandshake, PenLine, Shield, Wind } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getFocusArea } from '@/content/focusAreas'
import { StreakRing } from '@/components/StreakRing'
import { DailyVerse } from '@/components/DailyVerse'

const tools = [
  { href: '/emergency', name: 'Breathing and grounding', detail: 'Use a simple tool for this moment.', icon: Wind },
  { href: '/focus', name: 'Choose a focus', detail: 'Explore support without a label.', icon: Shield },
  { href: '/journal', name: 'Write privately', detail: 'Your journal stays on this device.', icon: PenLine },
  { href: '/scripture', name: 'Scripture, if you wish', detail: 'Faith is available by choice.', icon: BookOpen },
]

export function HomePage({ streak, verses, onStayedClean, onStumbledToday, checkedInToday }) {
  const { appState } = useApp()
  const firstGoal = appState.goals?.[0]
  const focusName = firstGoal ? getFocusArea(firstGoal.focusId)?.title : null

  return <div className="v2-home">
    <section className="v2-home-lead">
      <div className="v2-home-main">
        <h1>What would help right now?</h1>
        <p>GraceGrip offers private, practical support for the change you choose. We are a Christian mission; prayer and Scripture are always optional.</p>
        <Link className="v2-home-help" href="/emergency">Help Now <ArrowRight size={19} aria-hidden="true" /></Link>
        <div className="v2-home-tool-list" aria-label="Support options">{tools.map(({ href, name, detail, icon: Icon }) => <Link href={href} key={name}><Icon aria-hidden="true" size={21} /><span><strong>{name}</strong><small>{detail}</small></span><ArrowRight aria-hidden="true" size={17} /></Link>)}</div>
      </div>
      <aside className="v2-home-today"><h2>One step today</h2><p>{focusName ? `For your ${focusName.toLowerCase()} goal, choose one action you can take today.` : 'You can explore a focus area, or start with a tool. No setup is required.'}</p><Link href={firstGoal ? `/focus/${firstGoal.focusId}` : '/focus'}>{firstGoal ? 'Open my focus' : 'Find my focus'} <ArrowRight size={17} aria-hidden="true" /></Link><div className="v2-home-day-links"><Link href="/devotional"><BookMarked size={17} aria-hidden="true" /> Today’s devotional</Link><Link href="/scripture"><BookOpen size={17} aria-hidden="true" /> Scripture</Link></div></aside>
    </section>

    <section className="v2-home-areas"><div><h2>Support for the path you choose</h2><p>Alcohol, sexual habits, anger, nicotine, gambling, gaming and digital habits, and other drug use each have their own guide. Stress, loneliness, grief, and relationships can also be part of the story.</p></div><Link href="/focus">Explore seven focus areas <ArrowRight size={17} aria-hidden="true" /></Link></section>

    <section className="v2-home-secondary"><div className="v2-home-verse"><h2>Faith, when you want it</h2><p>Prayer and Scripture are here by invitation.</p><DailyVerse verses={verses} /></div><div className="v2-home-giving"><HeartHandshake size={26} aria-hidden="true" /><h2>Help keep GraceGrip free</h2><p>Every support tool stays free. Giving is voluntary and opens an external service.</p><a href="https://ko-fi.com/aikusan" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a></div></section>

    <section className="v2-home-progress"><h2>Your progress, in private</h2><p>See your chosen check-ins and permanent emblems. They stay on this device unless you explicitly choose a later sync option.</p><Link href="/progress">View private progress <ArrowRight size={17} aria-hidden="true" /></Link>{streak?.longest > 0 && <details><summary>Legacy streak history</summary><div className="v2-legacy-inner"><StreakRing count={streak.count} longest={streak.longest || 0} /><p>Your earlier progress remains separate from your new goals.</p><div className="actions-row"><button className="btn-primary" onClick={onStayedClean} disabled={checkedInToday}>{checkedInToday ? 'Checked in today' : 'Record legacy check-in'}</button><button className="btn-ghost" onClick={onStumbledToday}>Record a setback</button></div></div></details>}</section>
  </div>
}
