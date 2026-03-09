/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
'use client'

import { Trophy } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { getMilestoneMessage } from '../data/encouragements'

const MILESTONES = [1, 3, 7, 14, 21, 30, 60, 90, 180, 365]

export function StreakRing({ count, longest: _longest }) {
  const shouldReduceMotion = useReducedMotion()
  const milestone = getMilestoneMessage(count)

  const nextMilestone = MILESTONES.find((m) => m > count) ?? MILESTONES[MILESTONES.length - 1]

  const fill = count >= 365 ? 1 : Math.min(1, count / Math.max(1, nextMilestone))

  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - fill)
  const isMilestone = MILESTONES.includes(count)

  return (
    <div className={`streak-ring-wrap${isMilestone ? ' streak-ring-wrap-milestone' : ''}`}>
      <div className="streak-ring-svg-wrap" data-milestone={isMilestone ? 'true' : undefined}>
        <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
          <circle cx="80" cy="80" r={radius} fill="none" className="streak-ring-track-circle" strokeWidth="10" />
          <motion.circle
            key={count}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="streak-ring-inner">
          <motion.div
            key={`trophy-${count}`}
            animate={isMilestone && !shouldReduceMotion ? { scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] } : { scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Trophy size={20} className="streak-ring-trophy" aria-hidden="true" />
          </motion.div>
          <motion.span
            className="streak-ring-count"
            key={count}
            initial={shouldReduceMotion ? false : { y: 10, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
          >
            {count}
          </motion.span>
          <span className="streak-ring-label">days</span>
        </div>
      </div>

      {milestone && <p className="streak-ring-title">{milestone.title}</p>}
      <p className="streak-ring-message">{milestone?.message}</p>
    </div>
  )
}
