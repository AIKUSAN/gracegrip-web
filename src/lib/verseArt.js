const VERSE_ART_BY_CATEGORY = {
  temptation: '/verse-art/temptation.svg',
  strength: '/verse-art/strength.svg',
  peace: '/verse-art/peace.svg',
  identity: '/verse-art/identity.svg',
  forgiveness: '/verse-art/forgiveness.svg',
  freedom: '/verse-art/freedom.svg',
}

export function getVerseArt(category) {
  const normalized = typeof category === 'string' ? category.toLowerCase() : ''
  return VERSE_ART_BY_CATEGORY[normalized] ?? VERSE_ART_BY_CATEGORY.peace
}

export function getVerseCategoryLabel(category) {
  const normalized = typeof category === 'string' ? category.toLowerCase() : ''
  if (!normalized) return 'Daily focus'
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function getVerseCategoryTone(category) {
  const normalized = typeof category === 'string' ? category.toLowerCase() : ''
  return Object.prototype.hasOwnProperty.call(VERSE_ART_BY_CATEGORY, normalized) ? normalized : 'peace'
}
