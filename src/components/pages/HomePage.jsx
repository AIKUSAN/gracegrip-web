/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, BookMarked, HeartHandshake, PenLine, Shield, Wind } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getFocusArea } from '@/content/focusAreas'
import { StreakRing } from '@/components/StreakRing'
import { DailyVerse } from '@/components/DailyVerse'

const tools = [
  { href: '/emergency', name: 'Breathing and grounding', mobileName: 'Breathing', detail: 'Use a simple tool for this moment.', mobileDetail: 'Pause here.', icon: Wind },
  { href: '/focus', name: 'Choose a focus', mobileName: 'Choose a focus', detail: 'Explore support without a label.', mobileDetail: 'Find a focus.', icon: Shield },
  { href: '/journal', name: 'Write privately', mobileName: 'Journal', detail: 'Your journal stays on this device.', mobileDetail: 'On this device.', icon: PenLine },
  { href: '/scripture', name: 'Scripture, if you wish', mobileName: 'Scripture', detail: 'Faith is available by choice.', mobileDetail: 'By choice.', icon: BookOpen },
]

export function HomePage({ streak, verses, onStayedClean, onStumbledToday, checkedInToday }) {
  const { appState } = useApp()
  const firstGoal = appState.goals?.[0]
  const focusName = firstGoal ? getFocusArea(firstGoal.focusId)?.title : null

  return <div className="cc-home">
    <section className="cc-home-lead">
      <div className="cc-home-main">
        <h1>What would help right now?</h1>
        <p>Private, practical support for the change you choose. GraceGrip is a Christian mission; prayer and Scripture are optional.</p>
        <Link className="cc-home-help" href="/emergency">Help Now <ArrowRight size={19} aria-hidden="true" /></Link>
        <div className="cc-home-tool-list" aria-label="Support options">{tools.map(({ href, name, mobileName, detail, mobileDetail, icon: Icon }) => <Link href={href} key={name}><Icon aria-hidden="true" size={21} /><span><strong><span className="cc-tool-name-full">{name}</span><span className="cc-tool-name-mobile">{mobileName}</span></strong><small><span className="cc-tool-detail-full">{detail}</span><span className="cc-tool-detail-mobile">{mobileDetail}</span></small></span><ArrowRight aria-hidden="true" size={17} /></Link>)}</div>
      </div>
      <aside className="cc-home-today"><span className="cc-home-today-tag">Today in GraceGrip</span><h2>One step today</h2><p>{focusName ? `For your ${focusName.toLowerCase()} goal, choose one action you can take today.` : 'You can explore a focus area, or start with a tool. No setup is required.'}</p><Link href={firstGoal ? `/focus/${firstGoal.focusId}` : '/focus'}>{firstGoal ? 'Open my focus' : 'Find my focus'} <ArrowRight size={17} aria-hidden="true" /></Link><div className="cc-home-day-links"><Link href="/devotional"><BookMarked size={17} aria-hidden="true" /> Today’s devotional</Link><Link href="/scripture"><BookOpen size={17} aria-hidden="true" /> Scripture</Link></div></aside>
    </section>

    <section className="cc-home-areas"><div><h2>Support for the path you choose</h2><p>Alcohol, sexual habits, anger, nicotine, gambling, gaming and digital habits, and other drug use each have their own guide. Stress, loneliness, grief, and relationships can also be part of the story.</p></div><Link href="/focus">Explore seven focus areas <ArrowRight size={17} aria-hidden="true" /></Link></section>

    <section className="cc-home-secondary"><div className="cc-home-verse"><h2>Faith, when you want it</h2><p>Prayer and Scripture are here by invitation.</p><DailyVerse verses={verses} /></div><div className="cc-home-giving"><HeartHandshake size={26} aria-hidden="true" /><h2>Help keep GraceGrip free</h2><p>Every support tool stays free. Giving is voluntary and opens an external service.</p><a href="https://ko-fi.com/aikusan" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a></div></section>

    <section className="cc-home-progress"><h2>Your progress, in private</h2><p>See your chosen check-ins and permanent emblems. They stay on this device unless you explicitly choose a later sync option.</p><Link href="/progress">View private progress <ArrowRight size={17} aria-hidden="true" /></Link>{streak?.longest > 0 && <details><summary>Legacy streak history</summary><div className="cc-inner"><StreakRing count={streak.count} longest={streak.longest || 0} /><p>Your earlier progress remains separate from your new goals.</p><div className="actions-row"><button className="cc-btn-primary" onClick={onStayedClean} disabled={checkedInToday}>{checkedInToday ? 'Checked in today' : 'Record legacy check-in'}</button><button className="cc-btn-ghost" onClick={onStumbledToday}>Record a setback</button></div></div></details>}</section>
  </div>
}
