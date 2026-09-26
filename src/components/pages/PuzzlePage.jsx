'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { TILE_TYPES, SESSION_SECONDS, makeRound, newPuzzle, chooseTile, placeTile, advancePuzzle, endPuzzle } from '@/lib/tilePuzzle'

function TileGlyph({ type }) {
  return <svg className="cc-tile-glyph" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'leaf' && <><path d="M51 12C28 12 13 23 13 42c0 7 5 11 12 11 19 0 29-18 26-41Z" /><path d="M16 50c8-12 17-20 31-29" /></>}
    {type === 'wave' && <><path d="M5 21c7-8 14-8 21 0s14 8 21 0 10-7 12-5" /><path d="M5 39c7-8 14-8 21 0s14 8 21 0 10-7 12-5" /></>}
    {type === 'sun' && <><circle cx="32" cy="32" r="11" /><path d="M32 5v8M32 51v8M5 32h8M51 32h8M13 13l6 6M45 45l6 6M51 13l-6 6M19 45l-6 6" /></>}
    {type === 'path' && <><path d="M15 57V43c0-7 7-9 16-11s17-4 17-12V7" /><path d="M9 13h13M42 53h13" /></>}
  </svg>
}

export function PuzzlePage() {
  const { appState, onFinishPuzzle } = useApp()
  const gamblingGoal = appState.goals?.some((goal) => goal.focusId === 'gambling')
  const [game, setGame] = useState(null)
  const saved = useRef(false)
  const gameRef = useRef(game)
  useEffect(() => { gameRef.current = game }, [game])

  useEffect(() => {
    if (game?.phase !== 'playing') return undefined
    const interval = window.setInterval(() => setGame((current) => advancePuzzle(current, 1)), 1000)
    return () => window.clearInterval(interval)
  }, [game?.phase])

  useEffect(() => {
    if (game?.phase === 'ended' && !saved.current) { saved.current = true; onFinishPuzzle(game.score) }
  }, [game?.phase, game?.score, onFinishPuzzle])

  useEffect(() => {
    window.render_game_to_text = () => JSON.stringify(gameRef.current ? {
      coordinateSystem: '3 by 3 grid; cell 0 is top left, indices increase left to right then downward',
      mode: gameRef.current.mode, phase: gameRef.current.phase, round: gameRef.current.round,
      cells: makeRound(gameRef.current.round).map((tile, index) => ({ index, tile, filled: Boolean(tile && gameRef.current.placed.includes(tile)) })),
      selected: gameRef.current.selected, score: gameRef.current.mode === 'challenge' ? gameRef.current.score : null,
      seconds: gameRef.current.seconds,
    } : { phase: 'choose-mode' })
    window.advanceTime = (ms) => setGame((current) => current ? advancePuzzle(current, ms / 1000) : current)
    return () => { delete window.render_game_to_text; delete window.advanceTime }
  }, [])

  const start = (mode) => { saved.current = false; setGame(newPuzzle(mode)) }
  const board = game ? makeRound(game.round) : []
  const secondsLeft = game?.mode === 'challenge' ? Math.max(0, SESSION_SECONDS - Math.floor(game.seconds)) : null

  return <div className="cc-page cc-puzzle"><Link className="cc-back" href="/emergency">← Help Now tools</Link><header className="cc-intro"><h1>A quiet pattern</h1><p>Fit four tiles into their matching spaces. This is an optional pause, not treatment. Breathing, grounding, and human help remain available.</p></header>
    {!game ? <section className="cc-puzzle-choice"><h2>Choose how to play</h2><button type="button" onClick={() => start('calm')}>Calm mode <span>Suggested three-minute pause. No score or failure. Stop anytime.</span></button>{!gamblingGoal && <button type="button" onClick={() => start('challenge')}>Challenge mode <span>Three minutes. One point for each tile placed correctly; no penalty for mistakes.</span></button>}{gamblingGoal && <p>For a gambling goal, only the score-free calm mode is offered.</p>}</section> : <>
      <div className="cc-puzzle-status"><span>{game.mode === 'challenge' ? `Time left ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}` : 'Calm mode · stop when you wish'}</span><span>{game.mode === 'challenge' ? `Score ${game.score} · personal best ${appState.puzzleBest || 0}` : `Pattern ${game.round + 1}`}</span></div>
      {game.phase === 'playing' ? <div className="cc-puzzle-play"><div className="cc-puzzle-board" role="group" aria-label="Nine-space tile board">{board.map((tile, index) => <button key={index} type="button" className={`cc-puzzle-slot${tile ? ` cc-puzzle-${tile}` : ' cc-puzzle-blank'}${tile && game.placed.includes(tile) ? ' is-filled' : ''}`} disabled={!tile || game.placed.includes(tile)} onClick={() => setGame((current) => placeTile(current, index))} aria-label={tile ? `${tile} space, ${game.placed.includes(tile) ? 'filled' : 'empty'}` : 'unused space'}>{tile && <TileGlyph type={tile} />}</button>)}</div><div className="cc-puzzle-controls"><h2>Choose a tile</h2><div className="cc-puzzle-tray" role="group" aria-label="Choose a tile">{TILE_TYPES.map((tile) => <button key={tile} type="button" disabled={game.placed.includes(tile)} aria-pressed={game.selected === tile} onClick={() => setGame((current) => chooseTile(current, tile))}><TileGlyph type={tile} />{tile}</button>)}</div><p className="cc-puzzle-message" role="status" aria-live="polite">{game.message}</p><button type="button" className="cc-back-button" onClick={() => setGame((current) => endPuzzle(current))}>Stop this session</button></div></div> : <section className="cc-puzzle-finish"><h2>Choose your next step</h2><p>{game.mode === 'challenge' ? `You placed ${game.score} tiles.` : 'Your quiet session is finished.'} You can leave the puzzle here.</p><div><Link href="/emergency">Return to Help Now</Link><Link href="/focus">Explore a focus area</Link><button type="button" onClick={() => start(game.mode)}>Play again</button></div></section>}
    </>}
  </div>
}
