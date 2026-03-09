/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
/**
 * Web Crypto API helpers for AES-GCM 256-bit encryption of sensitive localStorage data.
 *
 * Security model:
 * - A random device key is generated on first launch and stored in localStorage
 *   under a separate key (gracegrip_ek_v1), distinct from the user data key.
 * - Sensitive fields (journal entries, profile name, streak history) are encrypted
 *   before being written to localStorage and decrypted on load.
 * - Exported backup files contain ciphertext, protecting them from being read
 *   on other devices without the original device key.
 * - All crypto operations fall back to plaintext if Web Crypto is unavailable
 *   (no modern browser lacks it, but graceful degradation is always safer).
 */

const KEY_STORAGE_KEY = 'gracegrip_ek_v1'

const toBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))
const fromBase64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0))

/**
 * Returns the device-local AES-GCM 256-bit CryptoKey, generating and persisting
 * it on first call.  Returns null if SubtleCrypto is not available.
 *
 * @returns {Promise<CryptoKey|null>}
 */
const getOrCreateDeviceKey = async () => {
  try {
    const stored = window.localStorage.getItem(KEY_STORAGE_KEY)
    if (stored) {
      return await window.crypto.subtle.importKey(
        'raw',
        fromBase64(stored),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt'],
      )
    }

    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    )
    const exported = await window.crypto.subtle.exportKey('raw', key)
    window.localStorage.setItem(KEY_STORAGE_KEY, toBase64(exported))
    return key
  } catch {
    return null
  }
}

/**
 * Encrypts a plaintext string using the device key.
 * Returns a JSON sentinel string: `{"__enc":true,"iv":"...","ct":"..."}`.
 * Falls back to returning the original plaintext string if encryption fails.
 *
 * @param {string} plaintext
 * @returns {Promise<string>}
 */
export const encryptString = async (plaintext) => {
  if (typeof plaintext !== 'string') return String(plaintext ?? '')
  try {
    const key = await getOrCreateDeviceKey()
    if (!key) return plaintext

    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext),
    )
    return JSON.stringify({ __enc: true, iv: toBase64(iv), ct: toBase64(cipherBuffer) })
  } catch {
    return plaintext
  }
}

/**
 * Decrypts a value previously produced by encryptString.
 * Transparently passes through non-encrypted strings (forward + backward compatible).
 *
 * @param {string} value
 * @returns {Promise<string>}
 */
export const decryptString = async (value) => {
  if (typeof value !== 'string' || !value) return value ?? ''

  let parsed
  try {
    parsed = JSON.parse(value)
  } catch {
    return value // plain text — not a JSON sentinel, return as-is
  }

  if (!parsed || !parsed.__enc) return value // JSON but not our sentinel

  try {
    const key = await getOrCreateDeviceKey()
    if (!key) return value

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(parsed.iv) },
      key,
      fromBase64(parsed.ct),
    )
    return new TextDecoder().decode(decrypted)
  } catch {
    return value // decryption failure — return whatever we have rather than crashing
  }
}

/**
 * Serializes `value` to JSON then encrypts it.
 * Use for arrays and objects.
 *
 * @param {*} value
 * @returns {Promise<string>}
 */
export const encryptJson = async (value) => encryptString(JSON.stringify(value))

/**
 * Decrypts then JSON-parses.
 * Also handles legacy unencrypted storage where `value` is already the parsed type
 * (arrays/objects written before encryption was introduced).
 *
 * @param {string|any} value
 * @returns {Promise<any>}
 */
export const decryptJson = async (value) => {
  // Already a non-string (e.g. legacy array) — return directly, no decryption needed.
  if (typeof value !== 'string') return value ?? null

  const decrypted = await decryptString(value)
  try {
    return JSON.parse(decrypted)
  } catch {
    return null
  }
}
