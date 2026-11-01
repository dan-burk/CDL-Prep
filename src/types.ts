export interface Card {
  id: string
  section?: string
  page?: string
  front: string
  back: string
  why?: string
}

export type DeckId = 'general' | 'air-brakes' | 'combination'

export interface Deck {
  id: DeckId
  title: string
  /** What the real permit test looks like, e.g. "50 questions" */
  test: string
  /** Manual sections the deck covers, e.g. "Sections 1–3" */
  sections: string
  cards: Card[]
}

/** Leitner box for one card. Box 0 is new or just missed; higher boxes wait longer before coming back. */
export interface CardState {
  box: number
  due: number
  seen: number
  missed: number
}

export type Progress = Record<string, CardState>

export type FontChoice = 'lexend' | 'atkinson' | 'sans'
export type TextSize = 'md' | 'lg' | 'xl'

export interface Settings {
  font: FontChoice
  size: TextSize
  rate: number
  autoRead: boolean
  /** speechSynthesis voice name; empty means pick a good English voice automatically */
  voice: string
}
