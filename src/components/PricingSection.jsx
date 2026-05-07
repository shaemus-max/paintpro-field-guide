import { useState } from 'react'

const PRICE_FIELDS = [
  { key: 'priceQuart',   label: 'Quart',    abbr: 'Qt' },
  { key: 'priceGallon',  label: 'Gallon',   abbr: 'Gal' },
  { key: 'price5Gallon', label: '5-Gallon', abbr: '5G' },
]

function OverrideDot() {
  return (
    <span
      title="Manually overridden"
      className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 shrink-0"
    />
  )
}

export function PricingDisplay({ product, compact = false }) {
  const prices = PRICE_FIELDS.filter(f => product[f.key])
  if (!prices.length) return null

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap mt-1">
        {prices.map(f => (
          <span key={f.key} className="text-xs font-semibold text-gray-700">
            {f.abbr}: <span className="text-green-700">${product[f.key]}</span>
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {prices.map(f => (
          <div key={f.key} className="bg-green-50 rounded-xl p-3 text-center min-w-[90px]">
            <div className="text-xs text-gray-500 font-medium mb-0.5">{f.label}</div>
            <div className="text-lg font-bold text-gray-900">${product[f.key]}</div>
            <div className="text-xs text-gray-400">CAD</div>
          </div>
        ))}
      </div>
      {product._pricingUpdated && (
        <p className="text-xs text-gray-400 mt-2">
          Updated {new Date(product._pricingUpdated).toLocaleDateString('en-CA', { dateStyle: 'medium' })}
        </p>
      )}
    </div>
  )
}

export default function PricingSection({ product, editMode, saveOverride, clearFieldOverride }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})

  const hasPrices = PRICE_FIELDS.some(f => product[f.key])
  const anyOverridden = PRICE_FIELDS.some(f => product._overriddenFields?.includes(f.key))

  const startEdit = () => {
    setDraft({
      priceQuart:   product.priceQuart   || '',
      priceGallon:  product.priceGallon  || '',
      price5Gallon: product.price5Gallon || '',
    })
    setEditing(true)
  }

  const handleSave = () => {
    const updates = {}
    PRICE_FIELDS.forEach(f => {
      const v = String(draft[f.key] || '').trim()
      updates[f.key] = v || null
    })
    updates._pricingUpdated = new Date().toISOString()
    saveOverride(product.id, updates)
    setEditing(false)
  }

  const handleResetAll = () => {
    PRICE_FIELDS.forEach(f => clearFieldOverride?.(product.id, f.key))
    clearFieldOverride?.(product.id, '_pricingUpdated')
    setEditing(false)
  }

  if (!editMode && !hasPrices) return null

  if (editing) {
    return (
      <div className="card p-4">
        <h2 className="section-title text-lg mb-3">Pricing (CAD)</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          {PRICE_FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={draft[f.key]}
                  onChange={e => setDraft(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder="0.00"
                  className="w-24 border border-brand-dulux/40 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleSave} className="px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors">✓ Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">✕ Cancel</button>
          {anyOverridden && clearFieldOverride && (
            <button onClick={handleResetAll} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-200 transition-colors">↺ Reset to Default</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title text-lg flex items-center gap-1">
          {anyOverridden && <OverrideDot />}
          Pricing (CAD)
        </h2>
        {editMode && (
          <button
            onClick={startEdit}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            ✏ Edit Prices
          </button>
        )}
      </div>
      {hasPrices ? (
        <PricingDisplay product={product} />
      ) : (
        <p className="text-sm text-gray-400 italic">No prices set — click Edit Prices to add</p>
      )}
    </div>
  )
}
