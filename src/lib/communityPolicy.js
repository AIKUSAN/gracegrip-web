import { AVATARS } from '../content/avatars.js'

export const COMMUNITY_RULES_VERSION = 1
export const CHAT_DAYS = 30
export const INCIDENT_DAYS = 90

const firstNames = ['Quiet', 'Steady', 'Open', 'Gentle', 'Bright', 'Still', 'Kind', 'Fresh']
const secondNames = ['River', 'Cedar', 'Harbor', 'Meadow', 'Lantern', 'Willow', 'Field', 'Stone']

export function freshAlias(bytes = crypto.getRandomValues(new Uint8Array(3))) {
  const first = firstNames[bytes[0] % firstNames.length]
  const second = secondNames[bytes[1] % secondNames.length]
  return `${first} ${second} ${String(bytes[2]).padStart(3, '0')}`
}

export function validateAvatar(id) { return AVATARS.includes(id) ? id : null }

export function validateAlias(input) {
  const value = typeof input === 'string' ? input.trim().replace(/\s+/g, ' ') : ''
  if (value.length < 3 || value.length > 24 || !/^[\p{L}\p{N} _-]+$/u.test(value)) return null
  return value
}

export function validatePost(input) {
  const value = typeof input === 'string' ? input.trim().replace(/\r\n?/g, '\n') : ''
  if (!value || value.length > 700 || Array.from(value).some((character) => character.charCodeAt(0) < 32 && ![9, 10].includes(character.charCodeAt(0)))) return null
  // The first room is text-only and has no outbound links, handles, or media.
  if (/(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|org|net|app|io|co|gg|me)\b|\b\S+@\S+\.\S+\b)/i.test(value)) return null
  return value
}

export function retentionDate(days, from = Date.now()) { return new Date(from + days * 86_400_000).toISOString() }
