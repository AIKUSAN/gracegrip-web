import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const contentDir = path.join(root, 'content')

const readJson = (name) => {
  const filePath = path.join(contentDir, name)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const validateEmotions = (emotions) => {
  assert(Array.isArray(emotions), 'emotions.json must be an array')
  emotions.forEach((emotion, index) => {
    assert(typeof emotion.id === 'string' && emotion.id, `emotions[${index}].id must be a non-empty string`)
    assert(typeof emotion.label === 'string' && emotion.label, `emotions[${index}].label must be a non-empty string`)
    assert(typeof emotion.prompt === 'string' && emotion.prompt, `emotions[${index}].prompt must be a non-empty string`)
  })
}

const validateVerses = (verses, emotionIds) => {
  assert(Array.isArray(verses), 'verses.json must be an array')
  verses.forEach((verse, index) => {
    assert(typeof verse.id === 'string' && verse.id, `verses[${index}].id must be a non-empty string`)
    assert(typeof verse.reference === 'string' && verse.reference, `verses[${index}].reference must be a non-empty string`)
    assert(typeof verse.text === 'string' && verse.text, `verses[${index}].text must be a non-empty string`)
    assert(Array.isArray(verse.emotions), `verses[${index}].emotions must be an array`)
    verse.emotions.forEach((emotionId, emotionIndex) => {
      assert(
        typeof emotionId === 'string' && emotionIds.has(emotionId),
        `verses[${index}].emotions[${emotionIndex}] must reference an existing emotion id`,
      )
    })
    assert(typeof verse.panic === 'boolean', `verses[${index}].panic must be true or false`)
  })
}

const validateDevotionals = (devotionals) => {
  assert(Array.isArray(devotionals), 'devotionals.json must be an array')
  devotionals.forEach((devotional, index) => {
    assert(typeof devotional.id === 'string' && devotional.id, `devotionals[${index}].id must be a non-empty string`)
    assert(typeof devotional.day === 'number', `devotionals[${index}].day must be a number`)
    assert(typeof devotional.title === 'string' && devotional.title, `devotionals[${index}].title must be a non-empty string`)
    assert(typeof devotional.verse === 'string' && devotional.verse, `devotionals[${index}].verse must be a non-empty string`)
    assert(typeof devotional.verseText === 'string' && devotional.verseText, `devotionals[${index}].verseText must be a non-empty string`)
    assert(typeof devotional.reflection === 'string' && devotional.reflection, `devotionals[${index}].reflection must be a non-empty string`)
    assert(typeof devotional.prayer === 'string' && devotional.prayer, `devotionals[${index}].prayer must be a non-empty string`)
    assert(typeof devotional.actionStep === 'string' && devotional.actionStep, `devotionals[${index}].actionStep must be a non-empty string`)
  })
}

try {
  const emotions = readJson('emotions.json')
  const verses = readJson('verses.json')
  const devotionals = readJson('devotionals.json')

  validateEmotions(emotions)
  validateVerses(verses, new Set(emotions.map((item) => item.id)))
  validateDevotionals(devotionals)

  console.log('Content validation passed.')
} catch (error) {
  console.error('Content validation failed:', error.message)
  process.exit(1)
}
