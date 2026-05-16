import { useState, useEffect } from 'react'

const CUSTOM_KEY  = 'paintpro-custom-products'
const HIDDEN_KEY  = 'paintpro-hidden-products'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useCustomProducts() {
  const [customProducts, setCustomProducts] = useState(() => load(CUSTOM_KEY, []))
  const [hiddenIds,      setHiddenIds]      = useState(() => load(HIDDEN_KEY, []))

  useEffect(() => { save(CUSTOM_KEY, customProducts) }, [customProducts])
  useEffect(() => { save(HIDDEN_KEY, hiddenIds)      }, [hiddenIds])

  const addProduct = (fields) => {
    const id = (fields.brandKey || 'custom') + '-' + fields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const newProduct = {
      id,
      brand:       fields.brand,
      brandKey:    fields.brandKey,
      name:        fields.name,
      shortName:   fields.name,
      productCode: fields.productCode || '',
      category:    fields.category,
      subcategory: fields.category,
      description: fields.description || '',
      sheens:      fields.sheens ? fields.sheens.split(',').map(s => s.trim()).filter(Boolean) : [],
      voc:         fields.voc || '',
      coverage:    fields.coverage || '',
      touchDry:    fields.touchDry || '',
      recoat:      fields.recoat || '',
      filmThicknessWet: fields.filmThicknessWet || '',
      filmThicknessDry: fields.filmThicknessDry || '',
      finish:      fields.finish || '',
      bases:       fields.bases ? fields.bases.split(',').map(s => s.trim()).filter(Boolean) : [],
      sizes:       fields.sizes ? fields.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      tdsUrl:      fields.tdsUrl || '',
      sdsUrl:      fields.sdsUrl || '',
      features:    fields.features ? fields.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      idealUses:   fields.idealUses ? fields.idealUses.split(',').map(s => s.trim()).filter(Boolean) : [],
      surfaces:    fields.surfaces ? fields.surfaces.split(',').map(s => s.trim()).filter(Boolean) : [],
      priceGallon:  fields.priceGallon  || '75.00',
      price5Gallon: fields.price5Gallon || '320.00',
      isCustom: true,
    }
    setCustomProducts(prev => [newProduct, ...prev])
    return newProduct
  }

  const deleteCustomProduct = (id) => {
    setCustomProducts(prev => prev.filter(p => p.id !== id))
  }

  const hideBuiltInProduct = (id) => {
    setHiddenIds(prev => prev.includes(id) ? prev : [...prev, id])
  }

  const restoreProduct = (id) => {
    setHiddenIds(prev => prev.filter(x => x !== id))
  }

  return {
    customProducts,
    hiddenIds,
    addProduct,
    deleteCustomProduct,
    hideBuiltInProduct,
    restoreProduct,
  }
}