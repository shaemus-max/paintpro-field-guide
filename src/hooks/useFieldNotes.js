import { useState, useEffect } from 'react'

const KEY = 'paintpro-notes'

export function useFieldNotes() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
    catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = (productId, productName, text) => {
    const entry = { id: Date.now(), text, ts: new Date().toISOString(), productName }
    setNotes(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), entry],
    }))
  }

  const deleteNote = (productId, noteId) => {
    setNotes(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).filter(n => n.id !== noteId),
    }))
  }

  const getNotes = (productId) => notes[productId] || []

  const allNotes = Object.entries(notes)
    .filter(([, arr]) => arr.length > 0)
    .map(([productId, arr]) => ({ productId, notes: arr }))

  return { addNote, deleteNote, getNotes, allNotes }
}
