import { useState } from 'react'

export function useCompare(max = 4) {
  const [compareList, setCompareList] = useState([])

  const addToCompare = (id) => {
    if (compareList.includes(id) || compareList.length >= max) return
    setCompareList(prev => [...prev, id])
  }
  const removeFromCompare = (id) => setCompareList(prev => prev.filter(x => x !== id))
  const clearCompare = () => setCompareList([])
  const inCompare = (id) => compareList.includes(id)

  return { compareList, addToCompare, removeFromCompare, clearCompare, inCompare }
}
