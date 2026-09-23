/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */

export const FEEDBACK_MESSAGE_RETENTION_DAYS = 90

export function feedbackMessageCutoff(now = Date.now()) {
  if (!Number.isFinite(now)) throw new TypeError('A valid timestamp is required.')
  return new Date(now - FEEDBACK_MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
}
