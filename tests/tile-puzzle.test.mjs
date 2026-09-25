import assert from 'node:assert/strict'
import { test } from 'node:test'
import { TILE_TYPES, makeRound, newPuzzle, chooseTile, placeTile, advancePuzzle, endPuzzle } from '../src/lib/tilePuzzle.js'

test('calm mode never scores or fails and can stop anytime', () => {
  let game = newPuzzle('calm')
  const leafSlot = makeRound(0).indexOf('leaf')
  game = chooseTile(game, 'leaf')
  game = placeTile(game, (leafSlot + 1) % 9)
  assert.equal(game.score, 0)
  assert.equal(game.phase, 'playing')
  game = placeTile(game, leafSlot)
  assert.ok(game.placed.includes('leaf'))
  assert.equal(game.score, 0)
  game = advancePuzzle(game, 181)
  assert.equal(game.phase, 'playing')
  assert.equal(endPuzzle(game).phase, 'ended')
})

test('challenge gives one point per correct tile and no mistake penalty', () => {
  let game = newPuzzle('challenge')
  const round = makeRound(0)
  for (const tile of TILE_TYPES) {
    game = chooseTile(game, tile)
    const slot = round.indexOf(tile)
    game = placeTile(game, slot)
  }
  assert.equal(game.score, 4)
  assert.equal(game.round, 1)
  game = advancePuzzle(game, 180)
  assert.equal(game.phase, 'ended')
  assert.equal(game.score, 4)
})
