export const MILESTONE_MESSAGES = [
  { minDays: 0, maxDays: 0, title: 'Day Zero', message: 'Today is the day everything changes. You showed up, and that takes courage.' },
  { minDays: 1, maxDays: 1, title: 'Day One', message: "Every journey starts with a single step. You've taken yours. Be proud of that." },
  { minDays: 2, maxDays: 2, title: 'Two Days Strong', message: 'You made it through another day. Momentum is building.' },
  { minDays: 3, maxDays: 4, title: 'Gaining Momentum', message: "Three days in. Your brain is already starting to notice the change. Keep going." },
  { minDays: 5, maxDays: 6, title: 'Almost a Week', message: "You're nearly at your first week. Every hour of freedom counts." },
  { minDays: 7, maxDays: 7, title: 'One Week!', message: 'Seven days of freedom. This is a real milestone. Your mind is already clearer.' },
  { minDays: 8, maxDays: 13, title: 'Building Strength', message: 'Past the first week and growing stronger daily. New neural pathways are forming.' },
  { minDays: 14, maxDays: 14, title: 'Two Weeks!', message: 'Fourteen days. The initial intensity is fading. You\'re building real resilience.' },
  { minDays: 15, maxDays: 20, title: 'Finding Your Stride', message: "You're past the hardest part. This is where lasting change takes root." },
  { minDays: 21, maxDays: 21, title: 'Three Weeks!', message: '21 days - the foundation of a new habit. Your brain is genuinely rewiring.' },
  { minDays: 22, maxDays: 29, title: 'Almost a Month', message: "You can see it on the horizon. A full month of freedom. Don't stop now." },
  { minDays: 30, maxDays: 30, title: 'One Month!', message: "30 days of freedom. This is huge. You're not the same person you were a month ago." },
  { minDays: 31, maxDays: 59, title: 'Walking in Freedom', message: "Past the one-month mark. Freedom is becoming your new normal." },
  { minDays: 60, maxDays: 60, title: 'Two Months!', message: "60 days. The chains are broken. You're living proof that change is possible." },
  { minDays: 61, maxDays: 89, title: 'Steady and Strong', message: "Deep roots take time. You're growing into something unshakeable." },
  { minDays: 90, maxDays: 90, title: '90 Days!', message: "Three months of freedom. Research says this is a critical brain reset milestone. You did it." },
  { minDays: 91, maxDays: 179, title: 'New Way of Life', message: "This isn't just a streak anymore. It's who you are. Keep walking in the light." },
  { minDays: 180, maxDays: 180, title: 'Six Months!', message: "Half a year of freedom. You are an inspiration. Your persistence is extraordinary." },
  { minDays: 181, maxDays: 364, title: 'Transformed', message: 'You are living in sustained freedom. The old life is behind you.' },
  { minDays: 365, maxDays: Infinity, title: 'One Year and Beyond!', message: 'A full year. What once felt impossible is now your reality. Keep shining.' },
]

export function getMilestoneMessage(days) {
  return MILESTONE_MESSAGES.find((m) => days >= m.minDays && days <= m.maxDays) ?? MILESTONE_MESSAGES[0]
}

export const EMERGENCY_ENCOURAGEMENTS = [
  'This urge will pass. It always does. Hold on.',
  'You are stronger than this moment. Breathe.',
  'Every second you resist is a victory.',
  'The urge is temporary. Your freedom is permanent.',
  "You didn't come this far to only come this far.",
  'God is with you right now, in this very moment.',
  'This feeling is not a command. You have a choice.',
  'Close your eyes. Breathe. You are not alone.',
  "Think about tomorrow morning. You'll be glad you held on.",
  'Your future self is cheering you on right now.',
  "The enemy wants you to believe you can't. God says you can.",
  "One more minute. Then one more. You've got this.",
]

export const DAILY_ENCOURAGEMENTS = [
  'You are loved beyond measure, exactly as you are today.',
  'Progress, not perfection. Every step forward matters.',
  "Grace isn't earned. It's already yours.",
  "Your past doesn't define your future. Today is a new day.",
  'Be kind to yourself. Recovery takes courage, and you have it.',
  'The light in you is stronger than the darkness around you.',
  'Every clean day is a gift — to yourself and to those who love you.',
  "God's mercies are new this morning. Receive them.",
  'You are becoming the person you were always meant to be.',
  "Freedom isn't the absence of struggle. It's the presence of hope.",
]
