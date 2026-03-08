import devotionalsJson from '../../content/devotionals.json'
import emotionsJson from '../../content/emotions.json'
import versesJson from '../../content/verses.json'

const ensureArray = (value, label) => {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`)
  }
  return value
}

export const devotionals = ensureArray(devotionalsJson, 'devotionals')
export const emotions = ensureArray(emotionsJson, 'emotions')
export const verses = ensureArray(versesJson, 'verses')
