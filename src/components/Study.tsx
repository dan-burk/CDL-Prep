import { useCallback, useEffect, useState } from 'react'
import { buildSession, grade, RETRY_GAP, SESSION_SIZE } from '../srs'
import type { Deck, Progress, Settings, TextSize } from '../types'
import { ProgressBar, SpeakerIcon } from './ui'

const CARD_SIZE: Record<TextSize, string> = { md: 'text-2xl sm:text-3xl', lg: 'text-3xl sm:text-4xl', xl: 'text-4xl sm:text-5xl' }
const WHY_SIZE: Record<TextSize, string> = { md: 'text-lg', lg: 'text-xl', xl: 'text-2xl' }

interface Props {
  deck: Deck
  progress: Progress
  onProgress: (p: Progress) => void
  settings: Settings
  speak: (text: string) => void
  onExit: () => void
}

/** Weakest cards first, for studying after everything is caught up */
function practiceSession(deck: Deck, progress: Progress) {
  return [...deck.cards]
    .sort((a, b) => (progress[a.id]?.box ?? 0) - (progress[b.id]?.box ?? 0) || (progress[b.id]?.missed ?? 0) - (progress[a.id]?.missed ?? 0))
    .slice(0, SESSION_SIZE)
    .map(c => c.id)
}

function newSession(deck: Deck, progress: Progress) {
  const ids = buildSession(deck.cards, progress)
  return ids.length ? ids : practiceSession(deck, progress)
}

export function Study({ deck, progress, onProgress, settings, speak, onExit }: Props) {
  const [queue, setQueue] = useState(() => newSession(deck, progress))
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [missedIds, setMissedIds] = useState<Set<string>>(new Set())

  const done = i >= queue.length
  const card = done ? undefined : deck.cards.find(c => c.id === queue[i])
  const uniqueCount = new Set(queue).size

  const readCard = useCallback(() => {
    if (!card) return
    speak(revealed ? [card.back, card.why].filter(Boolean).join('. ') : card.front)
  }, [card, revealed, speak])

  useEffect(() => {
    if (settings.autoRead) readCard()
  }, [readCard, settings.autoRead])

  const answer = useCallback((gotIt: boolean) => {
    if (!card) return
    onProgress(grade(progress, card.id, gotIt))
    if (!gotIt) {
      // Bring it back a few cards later so it gets repeated while it's fresh
      setMissedIds(s => new Set(s).add(card.id))
      setQueue(q => [...q.slice(0, i + 1 + RETRY_GAP), card.id, ...q.slice(i + 1 + RETRY_GAP)])
    }
    setRevealed(false)
    setI(n => n + 1)
  }, [card, i, onProgress, progress])

  // Keyboard on a computer: Space shows the answer, arrows grade, R reads again
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || (e.target instanceof HTMLElement && e.target.closest('button, select, input'))) return
      if (e.key === 'r' || e.key === 'R') readCard()
      else if (!revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); setRevealed(true) }
      else if (revealed && (e.key === 'ArrowLeft' || e.key === '1')) answer(false)
      else if (revealed && (e.key === 'ArrowRight' || e.key === '2')) answer(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer, done, readCard, revealed])

  const restart = () => {
    setQueue(newSession(deck, progress))
    setI(0)
    setRevealed(false)
    setMissedIds(new Set())
  }

  if (!card) {
    const firstTry = uniqueCount - missedIds.size
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12 text-center">
        <div className="text-6xl" aria-hidden>🚛</div>
        <h2 className="mt-4 text-3xl font-bold">Nice work!</h2>
        <p className="mt-3 text-xl">You got <b>{firstTry} of {uniqueCount}</b> right the first time.</p>
        {missedIds.size > 0 && <p className="mt-2 text-lg text-muted">The {missedIds.size} you missed will come back first next time.</p>}
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button onClick={restart} className="btn h-14 bg-accent px-8 text-lg text-accent-fg hover:bg-accent/90">Study more</button>
          <button onClick={onExit} className="btn h-14 bg-surface-2 px-8 text-lg hover:bg-border">Back to decks</button>
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-61px)] flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={i} max={queue.length} label="Session progress" /></div>
          <span className="shrink-0 tabular-nums text-muted">{i + 1} / {queue.length}</span>
        </div>

        <article className="card flex flex-1 flex-col p-5 sm:p-8" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <span className="label">{missedIds.has(card.id) ? 'Try again' : 'Question'}</span>
            <button onClick={readCard} className="btn -mr-2 -mt-2 h-11 bg-accent-soft px-3 text-accent hover:bg-accent/20" aria-label="Read out loud" title="Read out loud (R)">
              <SpeakerIcon />
            </button>
          </div>
          <p className={`mt-2 font-semibold leading-snug tracking-wide ${CARD_SIZE[settings.size]}`}>{card.front}</p>

          {revealed && (
            <div className="mt-6 border-t-2 border-dashed border-border pt-6">
              <span className="label">Answer</span>
              <p className={`mt-2 font-bold leading-snug tracking-wide text-accent ${CARD_SIZE[settings.size]}`}>{card.back}</p>
              {card.why && <p className={`mt-4 leading-relaxed text-muted ${WHY_SIZE[settings.size]}`}>{card.why}</p>}
            </div>
          )}

          {card.page && <p className="mt-auto pt-6 text-sm text-muted">Manual page {card.page}</p>}
        </article>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn h-16 w-full bg-accent text-xl text-accent-fg hover:bg-accent/90">Show answer</button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => answer(false)} className="btn h-16 border-2 border-bad bg-bad-soft text-xl text-bad hover:bg-bad/20">✗ Missed it</button>
              <button onClick={() => answer(true)} className="btn h-16 border-2 border-good bg-good-soft text-xl text-good hover:bg-good/20">✓ Got it</button>
            </div>
          )}
          <p className="mt-2 hidden text-center text-sm text-muted sm:block">
            {revealed ? '← Missed it · → Got it · R: read again' : 'Space: show answer · R: read again'}
          </p>
        </div>
      </footer>
    </div>
  )
}
