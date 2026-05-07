import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import BrandBadge from '../components/BrandBadge'
import ProductImage from '../components/ProductImage'

const SPEC_ROWS = [
  { label: 'Brand',        key: 'brand',             fmt: v => v },
  { label: 'Category',     key: 'category',           fmt: v => v },
  { label: 'Sheens',       key: 'sheens',             fmt: v => v?.join(', ') },
  { label: 'Bases',        key: 'bases',              fmt: v => v?.join(', ') },
  { label: 'Sizes',        key: 'sizes',              fmt: v => v?.join(', ') },
  { label: 'Coverage',     key: 'coverage',           fmt: v => v },
  { label: 'VOC',          key: 'voc',                fmt: v => v },
  { label: 'VOC Level',    key: 'vocLevel',           fmt: v => v },
  { label: 'Touch Dry',    key: 'touchDry',           fmt: v => v },
  { label: 'Recoat',       key: 'recoat',             fmt: v => v },
  { label: 'Film (Wet)',   key: 'filmThicknessWet',   fmt: v => v },
  { label: 'Finish Type',  key: 'finish',             fmt: v => v },
  { label: 'Product Code', key: 'productCode',        fmt: v => v },
  { label: 'Price (Gal)',  key: 'priceGallon',        fmt: v => v ? `$${v} CAD` : null },
]

export default function ComparePage({ products = [], compareList, onRemove, onClear }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(
    () => new Fuse(products, { keys: ['name', 'shortName', 'productCode', 'category'], threshold: 0.3 }),
    [products]
  )

  const selectedProducts = compareList.map(id => products.find(p => p.id === id)).filter(Boolean)

  const searchResults = query.trim()
    ? fuse.search(query).map(r => r.item).slice(0, 8)
    : []

  const copyToClipboard = () => {
    if (selectedProducts.length < 2) return
    let text = `PaintPro Field Guide — Product Comparison\n${'='.repeat(50)}\n\n`
    SPEC_ROWS.forEach(row => {
      const vals = selectedProducts.map(p => row.fmt(p[row.key]) || '—').join(' | ')
      text += `${row.label.padEnd(16)}: ${vals}\n`
    })
    navigator.clipboard?.writeText(text)
      .then(() => alert('Comparison copied to clipboard!'))
      .catch(() => alert('Copy failed — try selecting and copying manually'))
  }

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-gray-900">Compare Products</h1>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              {selectedProducts.length >= 2 && (
                <button onClick={copyToClipboard} className="btn-secondary text-sm">
                  📋 Copy
                </button>
              )}
              <button onClick={onClear} className="btn-ghost text-sm text-red-500">
                Clear All
              </button>
            </div>
          )}
        </div>

        {compareList.length < 4 && (
          <div className="card p-4 mb-6 relative">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Add product to compare ({compareList.length}/4)
            </p>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products to add…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                {searchResults.map(p => {
                  const already = compareList.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      disabled={already}
                      onClick={() => { if (!already) { onRemove(p.id, true); setQuery('') } }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${already ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <BrandBadge brand={p.brand} />
                      <span className="text-sm text-gray-900 flex-1">{p.shortName}</span>
                      {already ? <span className="text-xs text-gray-400">Added</span> : <span className="text-xs text-brand-dulux">+ Add</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {selectedProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl mb-3">⚖️</p>
            <p className="text-gray-500 font-medium">No products selected</p>
            <p className="text-gray-400 text-sm mt-1">
              Add up to 4 products from search or product pages, or use the search above
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="w-36 text-left text-xs font-semibold text-gray-400 uppercase pb-4 pr-4">
                      Specification
                    </th>
                    {selectedProducts.map(p => (
                      <th key={p.id} className="pb-4 px-2 min-w-[160px]">
                        <div className="card p-3 text-left">
                          <ProductImage product={p} className="w-full h-24 rounded-lg mb-2" />
                          <BrandBadge brand={p.brand} className="mb-1" />
                          <p className="font-serif text-sm text-gray-900 leading-tight mt-1">{p.shortName}</p>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="text-xs text-red-400 hover:text-red-600 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC_ROWS.map(row => {
                    const vals = selectedProducts.map(p => row.fmt(p[row.key]) || '—')
                    const allSame = vals.every(v => v === vals[0])
                    return (
                      <tr key={row.key} className="border-t border-gray-100">
                        <td className="py-2.5 pr-4 text-xs font-semibold text-gray-500 uppercase align-top pt-3">
                          {row.label}
                        </td>
                        {selectedProducts.map((p, i) => (
                          <td
                            key={p.id}
                            className={`py-2.5 px-2 text-sm align-top pt-3 ${
                              !allSame ? 'text-brand-dulux font-medium' : 'text-gray-700'
                            }`}
                          >
                            {vals[i]}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Highlighted cells indicate differences between products.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
