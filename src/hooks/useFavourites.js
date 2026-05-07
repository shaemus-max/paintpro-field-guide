import { useState, useEffect } from 'react'

const KEY = 'paintpro-favourites'

export function useFavourites() {
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favs))
  }, [favs])

  const toggle = (id) => setFavs(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
  const isFav = (id) => favs.includes(id)

  return { favs, toggle, isFav }
}
