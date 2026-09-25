// Drafts for qualified substance-use and safeguarding review before GraceGrip 2.0 is released.
// Each path is a self-chosen topic, not a diagnosis.
export const FOCUS_AREAS = [
  {
    id: 'alcohol', title: 'Alcohol', summary: 'Make room to look at drinking patterns and decide on one next step.',
    firstStep: 'Notice when and where drinking feels hardest to change. Choose a person you could speak with today.',
    reflection: 'What tends to happen just before you drink more than you intended?',
    professional: 'A clinician or local alcohol service can help assess drinking and plan safe care. If you may be physically dependent, seek medical advice before changing use.',
    caution: 'Severe withdrawal can be dangerous. If you have serious symptoms after reducing or stopping, seek urgent medical care.',
    source: 'https://www.who.int/publications/i/item/9789241599405',
    dayMilestones: false,
  },
  {
    id: 'sexual-habits', title: 'Pornography and sexual habits', summary: 'Reflect on a sexual habit you personally want to change without shame or a label.',
    firstStep: 'Step away from the immediate trigger and choose one supportive action for the next few minutes.',
    reflection: 'What need or feeling were you hoping the habit would answer?',
    professional: 'If the behavior is distressing, difficult to change, or affecting relationships, a qualified mental-health professional can help you explore it.',
    caution: 'You do not need to decide whether this is an addiction to ask for support.',
    source: 'https://www.who.int/health-topics/mental-health',
    dayMilestones: true,
  },
  {
    id: 'anger', title: 'Anger and conflict', summary: 'Create distance from a heated moment and choose a safer response.',
    firstStep: 'Pause the exchange if it is safe to do so. Move away and return when you can speak without threatening or harming anyone.',
    reflection: 'Which feeling or need was underneath the anger?',
    professional: 'A counselor or conflict-support service can help when anger repeatedly harms you or others.',
    caution: 'If anyone is threatened or unsafe, seek local emergency help. If you are being abused, prioritize a safe place and specialist support.',
    source: 'https://www.apa.org/topics/anger/control',
    dayMilestones: false,
  },
  {
    id: 'nicotine', title: 'Nicotine and vaping', summary: 'Explore when nicotine feels useful and what you want instead.',
    firstStep: 'Name the setting, feeling, or routine linked to this urge. Consider a short change of scene.',
    reflection: 'Which time of day or situation makes nicotine most automatic?',
    professional: 'A clinician, pharmacist, or local quit service can discuss evidence-based cessation support.',
    caution: 'If stopping causes serious discomfort or you have health concerns, ask a health professional for help.',
    source: 'https://www.who.int/publications/i/item/9789240096431',
    dayMilestones: true,
  },
  {
    id: 'gambling', title: 'Gambling', summary: 'Pause betting and make the next financial choice easier to see.',
    firstStep: 'Close the betting screen. Consider asking a trusted person to help you create distance from funds or gambling access.',
    reflection: 'What was happening before you wanted to place a bet?',
    professional: 'A gambling support service or financial counselor can help with harm, debt, and ways to limit access.',
    caution: 'Avoid using a score or challenge to manage a gambling urge. The Help Now puzzle offers a score-free calm mode.',
    source: 'https://www.who.int/news-room/fact-sheets/detail/gambling',
    dayMilestones: false,
  },
  {
    id: 'digital-habits', title: 'Gaming and digital habits', summary: 'Decide how screens fit the life you want to live.',
    firstStep: 'Set the device down briefly and choose one offline action that matters to you.',
    reflection: 'What were you avoiding or seeking when the session lasted longer than you wanted?',
    professional: 'If gaming or screen use persistently disrupts sleep, work, relationships, or well-being, speak with a qualified professional.',
    caution: 'A lot of screen time alone does not establish a disorder.',
    source: 'https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder',
    dayMilestones: false,
  },
  {
    id: 'drugs', title: 'Other drug use', summary: 'Consider a safer next step and involve qualified help when needed.',
    firstStep: 'If you are not in immediate danger, identify one trusted person or local service you can contact about your use.',
    reflection: 'What situations make use more likely, and who could support a different choice?',
    professional: 'A local substance-use service or clinician can assess risks and plan care. Do not manage dependence or withdrawal alone.',
    caution: 'Suspected overdose, trouble breathing, or unresponsiveness requires emergency services now.',
    source: 'https://www.who.int/publications/i/item/9789241599405',
    dayMilestones: false,
  },
]

export const FOCUS_IDS = new Set(FOCUS_AREAS.map(({ id }) => id))
export const getFocusArea = (id) => FOCUS_AREAS.find((area) => area.id === id)
