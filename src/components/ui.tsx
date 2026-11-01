import type { ReactNode } from 'react'

interface SegmentedProps<T extends string | number> {
  label: string
  options: T[]
  value: T
  onChange: (value: T) => void
  render?: (option: T) => ReactNode
}

export function Segmented<T extends string | number>({ label, options, value, onChange, render }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-lg bg-surface-2 p-1">
      {options.map(option => (
        <button
          key={option}
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          // Solid fill for the chosen option: white-on-cream was nearly invisible
          className={`focus-ring min-h-11 flex-1 whitespace-nowrap rounded-lg px-3 py-2 font-semibold transition-colors motion-reduce:transition-none ${
            option === value ? 'bg-accent text-accent-fg' : 'text-muted hover:bg-border hover:text-text'
          }`}
        >
          {render ? render(option) : option}
        </button>
      ))}
    </div>
  )
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-2.5 overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-accent transition-[width] motion-reduce:transition-none" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  )
}

function Icon({ className = 'h-6 w-6', strokeWidth = 2, children }: { className?: string; strokeWidth?: number; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

export const SpeakerIcon = ({ className }: { className?: string }) => (
  <Icon className={className}><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></Icon>
)
export const CheckIcon = () => <Icon strokeWidth={2.5}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>
export const CrossIcon = () => <Icon strokeWidth={2.5}><path d="M6 6l12 12M18 6 6 18" /></Icon>

/** Same look and words everywhere, so he learns one "hear it" button */
export function SpeakButton({ onClick, title = 'Read aloud', className = '' }: { onClick: () => void; title?: string; className?: string }) {
  return (
    <button onClick={onClick} aria-label="Read aloud" title={title} className={`btn h-11 w-11 shrink-0 bg-accent-soft p-0 text-accent hover:bg-accent/20 ${className}`}>
      <SpeakerIcon />
    </button>
  )
}

export function IconButton({ label, onClick, className = '', children }: { label: string; onClick: () => void; className?: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-text motion-reduce:transition-none ${className}`}
    >
      {children}
    </button>
  )
}
