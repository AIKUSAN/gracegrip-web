import { FOCUS_AREAS } from './focusAreas.js'
import publishedArticles from './publishedArticles.json' with { type: 'json' }

// Editorial drafts for protected preview. Human owner and qualified reviewers must
// approve health and safeguarding claims before these pages become indexable.
const focusArticles = FOCUS_AREAS.map((area) => ({
  slug: `guide-${area.id}`,
  title: `A first step with ${area.title.toLowerCase()}`,
  description: area.summary,
  category: 'Focus guide',
  reviewStatus: 'pending',
  sections: [
    { heading: 'Begin with your own reason', body: `${area.summary} Choosing this topic is a way to ask for support; it does not give you a diagnosis.` },
    { heading: 'For this moment', body: area.firstStep },
    { heading: 'A question to carry', body: area.reflection },
    { heading: 'When more help matters', body: `${area.caution} ${area.professional}` },
  ],
  source: area.source,
  focusId: area.id,
}))

export const STARTER_RESOURCE_DRAFTS = [
  {
    slug: 'one-small-step',
    title: 'A small plan for a hard day',
    description: 'A gentle way to name a goal, notice a pattern, and ask for support.',
    category: 'Practical help',
    reviewStatus: 'pending',
    sections: [
      { heading: 'Choose your own aim', body: 'Write a change you would like to try in your own words. It can be modest. You do not need to decide on a diagnosis or promise a perfect outcome.' },
      { heading: 'Notice what comes first', body: 'Think about a recent difficult moment. What time, place, feeling, or interaction came before it? This is information for your next decision, not evidence of personal failure.' },
      { heading: 'Prepare one next step', body: 'Choose one action you can take if that situation returns, and one person or service you could contact. If you use GraceGrip’s private plan, keep only details you are comfortable storing on your device.' },
      { heading: 'Know when to involve a professional', body: 'Self-help is not enough for every situation. If substance use may involve dependence, severe withdrawal, overdose risk, or major harm, contact a qualified local service. Immediate danger calls for local emergency services.' },
    ],
    source: 'https://www.who.int/publications/i/item/9789241599405',
  },
  {
    slug: 'faith-by-invitation',
    title: 'Faith by invitation',
    description: 'How GraceGrip makes prayer and Scripture available without making them a condition of help.',
    category: 'Faith reflection',
    reviewStatus: 'pending',
    sections: [
      { heading: 'You are welcome here', body: 'GraceGrip is a Christian mission. We make prayer and Scripture available because they matter to many of us. You can also use the practical tools without opening either one.' },
      { heading: 'A quiet moment', body: 'If prayer would help, you might ask God for wisdom for your next choice and compassion for yourself and others. There is no required wording, and seeking professional care remains a faithful option.' },
      { heading: 'Stay connected', body: 'Faith can grow alongside human support. Consider reaching out to a trusted person, a local faith leader who understands boundaries, or a qualified professional when the situation calls for it.' },
    ],
    source: null,
  },
  ...focusArticles,
]

export const RESOURCE_ARTICLES = [
  ...publishedArticles,
  ...STARTER_RESOURCE_DRAFTS.filter((draft) => !publishedArticles.some((article) => article.slug === draft.slug)),
]

export const getResourceArticle = (slug) => RESOURCE_ARTICLES.find((article) => article.slug === slug)
