import { useState, useMemo, useCallback } from 'react'
import { allProducts } from '../data/index'

const STORAGE_KEY = 'paintpro-overrides'

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

export function useProductData() {
  const [overrides, setOverrides] = useState(loadOverrides)

  const products = useMemo(() =>
    allProducts.map(base => {
      const ov = overrides[base.id]
      if (!ov) return { ...base, _overriddenFields: [] }
      const meta = {}
      const data = {}
      Object.entries(ov).forEach(([k, v]) => {
        if (k.startsWith('_')) meta[k] = v
        else data[k] = v
      })
      return { ...base, ...data, ...meta, _overriddenFields: Object.keys(data) }
    }),
    [overrides]
  )

  const getProduct = useCallback(
    id => products.find(p => p.id === id) || null,
    [products]
  )

  const saveOverride = useCallback((productId, updates) => {
    setOverrides(prev => {
      const next = {
        ...prev,
        [productId]: { ...(prev[productId] || {}), ...updates, _lastUpdated: new Date().toISOString() },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearFieldOverride = useCallback((productId, field) => {
    setOverrides(prev => {
      const current = prev[productId]
      if (!current || !(field in current)) return prev
      const { [field]: _removed, ...rest } = current
      const remainingDataKeys = Object.keys(rest).filter(k => !k.startsWith('_'))
      let next
      if (remainingDataKeys.length === 0) {
        const { [productId]: _dropped, ...others } = prev
        next = others
      } else {
        next = { ...prev, [productId]: rest }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearProductOverrides = useCallback(productId => {
    setOverrides(prev => {
      const { [productId]: _dropped, ...rest } = prev
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
      return rest
    })
  }, [])

  const clearAllOverrides = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setOverrides({})
  }, [])

  const isOverridden = useCallback((productId, field) => {
    const ov = overrides[productId]
    return !!ov && field in ov && !field.startsWith('_')
  }, [overrides])

  const exportData = useCallback(() =>
    JSON.stringify(overrides, null, 2),
    [overrides]
  )

  const importData = useCallback(jsonString => {
    try {
      const data = JSON.parse(jsonString)
      if (typeof data !== 'object' || Array.isArray(data)) return false
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setOverrides(data)
      return true
    } catch { return false }
  }, [])

  return {
    products,
    getProduct,
    saveOverride,
    clearFieldOverride,
    isOverridden,
    clearProductOverrides,
    clearAllOverrides,
    exportData,
    importData,
    overrides,
    totalOverrideCount: Object.keys(overrides).length,
  }
}