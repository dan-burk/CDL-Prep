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
    <div role="radiogroup" aria-label={label} className="flex rounded-lg bg-surface-2 p-1">
      {options.map(option => (
        <button
          key={option}
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={`min-h-11 flex-1 whitespace-nowrap rounded-lg px-3 py-2 transition-colors motion-reduce:transition-none ${
            option === value ? 'bg-surface font-semibold text-text shadow-sm' : 'text-muted hover:text-text'
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

export function SpeakerIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

export function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
    >
      {children}
    </button>
  )
}
