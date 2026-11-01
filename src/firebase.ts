import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import type { Progress } from './types'

// Public web config, injected at build time from repo Variables (or .env.local in dev)
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Without config (a fresh clone with no .env.local) the app still runs, just signed out
export const firebaseReady = Boolean(config.apiKey && config.projectId)
const app = firebaseReady ? initializeApp(config) : undefined
const auth = app && getAuth(app)
const db = app && getFirestore(app)

export function onUser(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// Popup rather than redirect: redirects break when the site (github.io domain) and authDomain differ
export const signIn = () => auth && signInWithPopup(auth, new GoogleAuthProvider())
export const signOutUser = () => auth && signOut(auth)

/** One document per person: users/{uid} holds their card progress */
export async function loadProgress(uid: string): Promise<Progress> {
  if (!db) return {}
  const snap = await getDoc(doc(db, 'users', uid))
  return (snap.data()?.progress as Progress | undefined) ?? {}
}

export async function saveProgress(uid: string, progress: Progress) {
  if (!db) return
  // Whole-document write: merging would keep old cards after "Start over"
  await setDoc(doc(db, 'users', uid), { progress, updatedAt: serverTimestamp() })
}
