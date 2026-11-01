import { useEffect, useState } from 'react'
import { canSpeak } from '../speech'
import type { FontChoice, Settings, TextSize } from '../types'
import { IconButton, Segmented } from './ui'

type Theme = 'system' | 'light' | 'dark'

const FONTS: Record<FontChoice, string> = { lexend: 'Lexend', atkinson: 'Atkinson', sans: 'Plain' }
const FONT_CLASS: Record<FontChoice, string> = { lexend: 'font-lexend', atkinson: 'font-atkinson', sans: 'font-sans' }
const SIZES: Record<TextSize, string> = { md: 'text-base', lg: 'text-xl', xl: 'text-2xl' }
const RATES = [0.75, 0.9, 1, 1.15]
const RATE_NAMES: Record<number, string> = { 0.75: 'Slow', 0.9: 'Easy', 1: 'Normal', 1.15: 'Fast' }

function readTheme(): Theme {
  try {
    const t = localStorage.getItem('theme')
    return t === 'light' || t === 'dark' ? t : 'system'
  } catch {
    return 'system'
  }
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches))
    apply()
    try {
      if (theme === 'system') localStorage.removeItem('theme')
      else localStorage.setItem('theme', theme)
    } catch { /* storage blocked: theme still applies for this visit */ }
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])
  return [theme, setTheme] as const
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="label">{label}</div>
      {children}
    </div>
  )
}

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
  voices: SpeechSynthesisVoice[]
  speak: (text: string) => void
  onReset: () => void
  onClose: () => void
}

export function SettingsPanel({ settings, onChange, voices, speak, onReset, onClose }: Props) {
  const [theme, setTheme] = useTheme()
  const [confirmReset, setConfirmReset] = useState(false)
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={e => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-border bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-card sm:rounded-lg sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Settings</h2>
          <IconButton label="Close settings" onClick={onClose}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </IconButton>
        </div>

        <div className="space-y-6">
          <Row label="Font">
            <Segmented label="Font" options={Object.keys(FONTS) as FontChoice[]} value={settings.font} onChange={v => set('font', v)}
              render={f => <span className={FONT_CLASS[f]}>{FONTS[f]}</span>} />
          </Row>

          <Row label="Card text size">
            <Segmented label="Card text size" options={Object.keys(SIZES) as TextSize[]} value={settings.size} onChange={v => set('size', v)}
              render={s => <span className={`${SIZES[s]} font-bold leading-none`}>Aa</span>} />
          </Row>

          {canSpeak ? (
            <>
              <Row label="Read cards out loud">
                <Segmented label="Read cards out loud" options={['on', 'off']} value={settings.autoRead ? 'on' : 'off'}
                  onChange={v => set('autoRead', v === 'on')} render={v => (v === 'on' ? 'Automatically' : 'Only when I tap 🔊')} />
              </Row>

              <Row label="Reading speed">
                <Segmented label="Reading speed" options={RATES} value={settings.rate} onChange={v => set('rate', v)} render={r => RATE_NAMES[r]} />
              </Row>

              <Row label="Voice">
                <div className="flex gap-2">
                  <select
                    aria-label="Voice"
                    value={settings.voice}
                    onChange={e => set('voice', e.target.value)}
                    className="min-h-11 min-w-0 flex-1 rounded-lg bg-surface-2 px-3 text-text outline-none focus:ring-4 focus:ring-accent/30"
                  >
                    <option value="">Best available</option>
                    {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                  </select>
                  <button onClick={() => speak('Check your mirrors every 5 to 8 seconds.')} className="btn min-h-11 bg-accent-soft text-accent hover:bg-accent/20">Test</button>
                </div>
                <p className="text-sm text-muted">Voices with "Natural" in the name sound best. Edge on a computer has the most.</p>
              </Row>
            </>
          ) : (
            <p className="rounded-lg bg-bad-soft p-3 text-bad">This browser can't read out loud. Try Chrome, Edge or Safari.</p>
          )}

          <Row label="Colors">
            <Segmented label="Colors" options={['system', 'light', 'dark'] as Theme[]} value={theme} onChange={setTheme}
              render={t => ({ system: 'Auto', light: 'Light', dark: 'Dark' })[t]} />
          </Row>

          <Row label="Progress">
            {confirmReset ? (
              <div className="flex gap-2">
                <button onClick={() => { onReset(); setConfirmReset(false) }} className="btn min-h-11 flex-1 bg-bad text-white hover:bg-bad/90">Yes, erase it</button>
                <button onClick={() => setConfirmReset(false)} className="btn min-h-11 flex-1 bg-surface-2 hover:bg-border">Keep it</button>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="btn min-h-11 bg-surface-2 text-bad hover:bg-border">Start over (erase progress)</button>
            )}
            <p className="text-sm text-muted">Progress is saved on this device only.</p>
          </Row>
        </div>
      </div>
    </div>
  )
}
