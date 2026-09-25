export const TILE_TYPES = ['leaf', 'wave', 'sun', 'path']
export const SESSION_SECONDS = 180

export function makeRound(roundIndex) {
  const cells = [null, null, null, null, null, null, null, null, null]
  const slots = [0, 2, 4, 6].map((start) => (start + roundIndex) % 9)
  for (let i = 0; i < TILE_TYPES.length; i += 1) cells[slots[i]] = TILE_TYPES[i]
  return cells
}

export function newPuzzle(mode) {
  return { mode: mode === 'challenge' ? 'challenge' : 'calm', phase: 'playing', round: 0, placed: [], score: 0, seconds: 0, selected: null, message: 'Choose a tile, then choose its matching space.' }
}

export function chooseTile(state, tile) {
  if (state.phase !== 'playing' || !TILE_TYPES.includes(tile) || state.placed.includes(tile)) return state
  return { ...state, selected: tile, message: `${tile} selected. Choose its matching space.` }
}

export function placeTile(state, slotIndex) {
  if (state.phase !== 'playing' || state.selected === null || !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 8) return state
  const round = makeRound(state.round)
  const expected = round[slotIndex]
  if (expected !== state.selected) return { ...state, message: 'That tile fits somewhere else. Try another space.' }
  const placed = [...state.placed, state.selected]
  const score = state.mode === 'challenge' ? state.score + 1 : 0
  if (placed.length === TILE_TYPES.length) return { ...state, round: state.round + 1, placed: [], selected: null, score, message: 'Pattern complete. A new pattern is ready.' }
  return { ...state, placed, selected: null, score, message: 'Tile placed. Choose another tile.' }
}

export function advancePuzzle(state, seconds) {
  if (state.phase !== 'playing') return state
  const elapsed = Math.max(0, state.seconds + Math.max(0, seconds))
  if (state.mode === 'challenge' && elapsed >= SESSION_SECONDS) return { ...state, seconds: SESSION_SECONDS, phase: 'ended', message: 'Three minutes complete. Choose a next step outside the puzzle.' }
  if (state.mode === 'calm' && state.seconds < SESSION_SECONDS && elapsed >= SESSION_SECONDS) return { ...state, seconds: elapsed, message: 'Three minutes have passed. You can stop or keep placing tiles.' }
  return { ...state, seconds: elapsed }
}

export function endPuzzle(state) { return { ...state, phase: 'ended', selected: null, message: 'Session finished. Choose a next step outside the puzzle.' } }
