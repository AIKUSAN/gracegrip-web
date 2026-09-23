/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { createHash } from 'node:crypto'

export function normalizeCreatedAt(value) {
  const match = typeof value === 'string'
    ? /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.(\d{1,6}))?Z$/.exec(value)
    : null
  if (!match) throw new Error('Invalid feedback timestamp.')
  return `${match[1]}.${(match[2] ?? '').padEnd(6, '0')}Z`
}

export function fingerprintRow(row) {
  return createHash('sha256')
    .update(JSON.stringify([
      row.id.toLowerCase(),
      normalizeCreatedAt(row.created_at),
      Number(row.rating),
      row.message ?? null,
    ]))
    .digest('hex')
}

export function validateD1Count(sourceCount, d1Count, allowD1Only = false) {
  if (!Number.isSafeInteger(d1Count) || d1Count < sourceCount) {
    throw new Error('D1 total row count is invalid or lower than the Neon count.')
  }
  const additional = d1Count - sourceCount
  if (additional > 0 && !allowD1Only) {
    throw new Error('D1 contains additional rows; use --allow-d1-only only when expected.')
  }
  return additional
}

export async function reconcileRows(rows, { insert, lookup }) {
  for (const row of rows) {
    await insert(row)
    const persisted = await lookup(row.id)
    if (!persisted || fingerprintRow(persisted) !== fingerprintRow(row)) {
      throw new Error('Feedback row reconciliation mismatch.')
    }
  }
  return rows.length
}
