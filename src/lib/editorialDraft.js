const CATEGORIES = new Set(['Focus guide', 'Practical help', 'Faith reflection'])
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''

export function validateArticleDraft(input) {
  if (!input || typeof input !== 'object') return null
  const slug = clean(input.slug, 80).toLowerCase()
  const title = clean(input.title, 120)
  const description = clean(input.description, 250)
  const category = clean(input.category, 40)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || !title || !description || !CATEGORIES.has(category)) return null
  if (!Array.isArray(input.sections) || input.sections.length < 1 || input.sections.length > 12) return null
  const sections = input.sections.map((section) => ({ heading: clean(section?.heading, 120), body: clean(section?.body, 3000) }))
  if (sections.some((section) => !section.heading || !section.body)) return null
  const source = clean(input.source, 500)
  if (source) {
    try { if (new URL(source).protocol !== 'https:') return null } catch { return null }
  }
  const penName = clean(input.penName, 80)
  if (penName && input.bylineConsent !== true) return null
  return { slug, title, description, category, sections, source: source || null, penName: penName || null, bylineConsent: Boolean(penName) }
}

export function parseChatGPTDraft(markdown) {
  if (typeof markdown !== 'string' || markdown.length > 20_000) return null
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  let title = ''
  const sections = []
  let current = null
  for (const line of lines) {
    if (line.startsWith('# ') && !title) { title = line.slice(2).trim(); continue }
    if (line.startsWith('## ')) {
      if (current) sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
      current = { heading: line.slice(3).trim(), body: [] }
    } else if (current) current.body.push(line)
  }
  if (current) sections.push({ heading: current.heading, body: current.body.join('\n').trim() })
  if (!title || sections.length === 0) return null
  return { title: title.slice(0, 120), sections: sections.filter((section) => section.heading && section.body).slice(0, 12) }
}
