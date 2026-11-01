import { DECKS } from '../decks'
import { deckStats } from '../srs'
import type { DeckId, Progress } from '../types'
import { ProgressBar, SpeakerIcon } from './ui'

const INTRO = 'Pick a test to study. Each card reads itself out loud. Tap Got it or Missed it. Missed cards come back soon, so you see them again and again until they stick.'

function whenNext(next: number) {
  const days = Math.ceil((next - Date.now()) / (24 * 60 * 60 * 1000))
  return days <= 1 ? 'tomorrow' : `in ${days} days`
}

export function Home({ progress, onStudy, onSpeak }: { progress: Progress; onStudy: (id: DeckId) => void; onSpeak: (text: string) => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-start gap-3">
        <p className="flex-1 text-lg leading-relaxed">{INTRO}</p>
        <button onClick={() => onSpeak(INTRO)} aria-label="Read this to me" title="Read this to me" className="btn h-11 shrink-0 bg-surface-2 px-3 text-text hover:bg-border">
          <SpeakerIcon />
        </button>
      </div>

      <div className="grid gap-4">
        {DECKS.map(deck => {
          const s = deckStats(deck.cards, progress)
          const todo = s.due + s.unseen
          return (
            <section key={deck.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-2xl font-bold">{deck.title}</h2>
                <span className="text-muted">Real test: {deck.test}, need 80%</span>
              </div>
              <div className="mt-4">
                <ProgressBar value={s.learned} max={s.total} label={`${deck.title} cards learned`} />
                <div className="mt-2 flex flex-wrap justify-between gap-x-4 text-muted">
                  <span><b className="text-text">{s.learned}</b> of {s.total} learned</span>
                  <span>
                    {todo > 0
                      ? <>{s.due > 0 && <><b className="text-text">{s.due}</b> to review · </>}<b className="text-text">{s.unseen}</b> new</>
                      : <>All caught up. Next review {whenNext(s.next)}.</>}
                  </span>
                </div>
              </div>
              <button onClick={() => onStudy(deck.id)} className="btn mt-5 h-14 w-full bg-accent text-lg text-accent-fg hover:bg-accent/90 sm:w-auto sm:px-10">
                {todo > 0 ? 'Study' : 'Practice anyway'}
              </button>
            </section>
          )
        })}
      </div>

      <footer className="mt-10 space-y-2 text-sm leading-relaxed text-muted">
        <p>
          Cards are written in plain words from the 2025 South Dakota CDL Manual. Each card shows the manual page so you can look it up.
          If a card ever disagrees with the manual, trust the manual.
        </p>
        <p>
          <a className="underline hover:text-text" href="https://dps.sd.gov/driver-licensing/commercial-drivers-license/cdl-manual" target="_blank" rel="noreferrer">SD CDL Manual</a>
          {' · '}
          <a className="underline hover:text-text" href="https://tpr.fmcsa.dot.gov" target="_blank" rel="noreferrer">Training Provider Registry</a>
        </p>
      </footer>
    </main>
  )
}
