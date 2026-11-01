import { useCallback, useEffect, useState } from 'react'
import { Home } from './components/Home'
import { SettingsPanel } from './components/SettingsPanel'
import { Study } from './components/Study'
import { TopBar } from './components/TopBar'
import { deckById } from './decks'
import { speak as say, stopSpeaking, useVoices } from './speech'
import { load, save } from './storage'
import type { DeckId, FontChoice, Progress, Settings } from './types'

const DEFAULT_SETTINGS: Settings = { font: 'lexend', size: 'lg', rate: 0.9, autoRead: true, voice: '' }
const FONT_CLASS: Record<FontChoice, string> = { lexend: 'font-lexend', atkinson: 'font-atkinson', sans: 'font-sans' }

export default function App() {
  const [deckId, setDeckId] = useState<DeckId | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => load('cdl.settings', DEFAULT_SETTINGS))
  const [progress, setProgress] = useState<Progress>(() => load('cdl.progress', {}))
  const voices = useVoices()

  useEffect(() => save('cdl.settings', settings), [settings])
  useEffect(() => save('cdl.progress', progress), [progress])

  const speak = useCallback(
    (text: string) => say(text, { rate: settings.rate, voice: settings.voice, voices }),
    [settings.rate, settings.voice, voices],
  )

  const exit = () => {
    stopSpeaking()
    setDeckId(null)
  }
  const deck = deckId && deckById(deckId)

  return (
    <div className={`min-h-[100dvh] ${FONT_CLASS[settings.font]}`}>
      <TopBar title={deck ? deck.title : 'CDL Prep · SD Class A'} onBack={deck ? exit : undefined} onSettings={() => setShowSettings(true)} />
      {deck
        ? <Study key={deck.id} deck={deck} progress={progress} onProgress={setProgress} settings={settings} speak={speak} onExit={exit} />
        : <Home progress={progress} onStudy={setDeckId} onSpeak={speak} />}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          voices={voices}
          speak={speak}
          onReset={() => setProgress({})}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
