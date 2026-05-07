import { useState, useRef, useCallback } from 'react'

export function useEditMode() {
  const [editMode, setEditMode] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const clickCountRef = useRef(0)
  const timerRef = useRef(null)

  const handleLogoClick = useCallback(() => {
    clickCountRef.current += 1
    clearTimeout(timerRef.current)

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0
      setShowToggle(true)
    } else {
      // Reset click count if no third click within 1.5 s
      timerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 1500)
    }
  }, [])

  const toggleEditMode = useCallback(() => setEditMode(v => !v), [])

  return { editMode, showToggle, handleLogoClick, toggleEditMode }
}
