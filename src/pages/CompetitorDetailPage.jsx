import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { competitors } from '../data/index'
import BrandBadge from '../components/BrandBadge'

const CATEGORY_DEFAULTS = {
  'Interior Paint':      { idealUses: ['Living rooms', 'Bedrooms', 'Hallways', 'Offices'], surfaces: ['Drywall', 'Plaster', 'Previously painted surfaces'] },
  'Exterior Paint':      { idealUses: ['Siding', 'Trim', 'Fascia', 'Exterior wood'], surfaces: ['Wood', 'Hardboard', 'Fibre cement', 'Previously painted surfaces'] },
  'Trim & Cabinet':      { idealUses: ['Interior trim', 'Doors', 'Cabinets', 'Millwork'], surfaces: ['Wood', 'MDF', 'Previously painted surfaces'] },
  'Primer':              { idealUses: ['New drywall', 'Previously painted surfaces', 'Bare wood'], surfaces: ['Drywall', 'Wood', 'Plaster', 'Masonry'] },
  'Masonry':             { idealUses: ['Concrete block', 'Stucco', 'Brick', 'Poured concrete'], surfaces: ['Concrete', 'Masonry', 'Stucco', 'Brick'] },
  'Industrial / Protective': { idealUses: ['Steel structures', 'Concrete floors', 'Equipment', 'Tanks'], surfaces: ['Steel', 'Concrete', 'Aluminum', 'Galvanized metal'] },
  'Metal & Industrial':  { idealUses: ['Structural steel', 'Equipment', 'Piping', 'Tanks'], surfaces: ['Steel', 'Iron', 'Aluminum', 'Galvanized metal'] },
  'Floor Coating':       { idealUses: ['Concrete floors', 'Garage floors', 'Warehouse floors'], surfaces: ['Concrete', 'Previously coated floors'] },
  'Ceiling Paint':       { idealUses: ['Interior ceilings', 'Stairwells'], surfaces: ['Drywall', 'Plaster', 'Previously painted surfaces'] },
  'Exterior Stain':      { idealUses: ['Decks', 'Fences', 'Siding', 'Exterior wood'], surfaces: ['Cedar', 'Pine', 'Pressure-treated wood', 'Weathered wood'] },
  'Interior Stain':      { idealUses: ['Interior wood trim', 'Cabinets', 'Furniture'], surfaces: ['Bare wood', 'Pine', 'Oak', 'MDF'] },
  'Specialty':           { idealUses: ['Special application surfaces'], surfaces: ['Varies by product'] },
  'Dryfall':             { idealUses: ['Ceilings in warehouses', 'Gymnasiums', 'Industrial spaces'], surfaces: ['Concrete', 'Steel', 'Drywall'] },
  'Caulk & Sealant':    { idealUses: ['Gaps around trim', 'Window and door frames', 'Expansion joints'], surfaces: ['Wood', 'Drywall', 'Masonry', 'Metal'] },
}

function SpecTile({ icon, label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const display = Array.isArray(value) ? value.join(', ') : value
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center min-w-[100px] shrink-0">
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="text-xs text-gray-500 font-medium mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900 leading-tight">{display}</div>
    </div>
  )
}

function SpecRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const display = Array.isArray(value) ? value.join(' · ') : value
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{display}</span>
    </div>
  )
}

export default function CompetitorDetailPage({ favs = [], onToggleFav, onAddCompare, inCompare, addNote, getNotes, deleteNote }) {
  const { id } = useParams()
  const product = competitors.find(p => p.id === id)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteText, setNoteText] = useState('')

  if (!product) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-gray-500">Competitor product not found.</p>
        <Link to="/" className="text-brand-dulux text-sm mt-3 inline-block hover:underline">
          Back to search
        </Link>
      </div>
    )
  }

  const isFav = favs.includes(product.id)
  const defaults = CATEGORY_DEFAULTS[product.category] || { idealUses: [], surfaces: [] }
  const idealUses = product.idealUses?.length > 0 ? product.idealUses : defaults.idealUses
  const surfaces  = product.surfaces?.length  > 0 ? product.surfaces  : defaults.surfaces
  const tdsHref   = product.tdsUrl
  const notes     = getNotes ? getNotes(product.id) : []

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    addNote && addNote(product.id, product.name, noteText.trim())
    setNoteText('')
    setShowNoteForm(false)
  }

  return (
    <div className="page-enter mb-bottom-nav">

      <div className="bg-white border-b border-gray-100">
        <div className="page-container py-2 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-brand-dulux">Products</Link>
          <span>›</span>
          <span className="capitalize">{product.category}</span>
          <span>›</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="page-container py-6">

        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">

            <div className="sm:w-48 sm:shrink-0">
              <div className="w-full h-48 sm:h-44 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                <span className="text-5xl opacity-20">🎨</span>
                <span className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wide">
                  {product.brandKey ? product.brandKey.toUpperCase() : ''}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <BrandBadge brand={product.brandKey} size="lg" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                  {product.category}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              {product.code && (
                <p className="text-xs text-gray-400 font-mono mb-3">SKU: {product.code}</p>
              )}

              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onToggleFav && onToggleFav(product.id)}
                  className={'btn-secondary ' + (isFav ? 'text-red-600 bg-red-50 hover:bg-red-100' : '')}
                >
                  {isFav ? '❤️ Saved' : '🤍 Save'}
                </button>
                <button
                  onClick={() => onAddCompare && onAddCompare(product.id)}
                  disabled={inCompare && inCompare(product.id)}
                  className={inCompare && inCompare(product.id) ? 'btn-secondary opacity-60' : 'btn-secondary'}
                >
                  {inCompare && inCompare(product.id) ? '✓ In Compare' : '⊕ Compare'}
                </button>
                <button onClick={() => setShowNoteForm(!showNoteForm)} className="btn-secondary">
                  📝 Field Note
                </button>
                {tdsHref && (
                  <a href={tdsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    TDS
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {showNoteForm && (
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add Field Note</h3>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="e.g. Customer uses this on commercial jobs. Good coverage."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-dulux"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveNote} className="btn-primary text-sm">Save Note</button>
              <button onClick={() => setShowNoteForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        {notes.length > 0 && (
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">📝 Field Notes</h3>
            <div className="space-y-2">
              {notes.map(note => (
                <div key={note.id} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3">
                  <div className="flex-1 text-sm text-gray-800">{note.text}</div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(note.ts).toLocaleDateString('en-CA')}
                    </span>
                    <button
                      onClick={() => deleteNote && deleteNote(product.id, note.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3">Quick Specs</h2>
              <div className="flex gap-2 overflow-x-auto pb-1 items-start">
                <SpecTile icon="✨" label="Sheens"     value={product.sheens} />
                <SpecTile icon="📐" label="Coverage"   value={product.coverage} />
                <SpecTile icon="🌿" label="VOC"        value={product.voc} />
                <SpecTile icon="⏰" label="Touch Dry"  value={product.touchDry} />
                <SpecTile icon="🔄" label="Recoat"     value={product.recoat} />
                <SpecTile icon="📏" label="Film Thick" value={product.filmThickness} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg">Technical Data</h2>
              <div className="divide-y divide-gray-100">
                <SpecRow label="Sheens"         value={product.sheens} />
                <SpecRow label="Coverage"       value={product.coverage} />
                <SpecRow label="VOC"            value={product.voc} />
                <SpecRow label="Touch Dry"      value={product.touchDry} />
                <SpecRow label="Recoat"         value={product.recoat} />
                <SpecRow label="Film Thickness" value={product.filmThickness} />
                <SpecRow label="Sizes"          value={product.sizes} />
                <SpecRow label="Product Code"   value={product.code} />
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="card p-4">
                <h2 className="section-title text-lg mb-3">Features and Benefits</h2>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-dulux mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">

            {idealUses.length > 0 && (
              <div className="card p-4">
                <h2 className="section-title text-lg mb-3">Ideal Uses</h2>
                <ul className="space-y-1.5">
                  {idealUses.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dulux shrink-0" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {surfaces.length > 0 && (
              <div className="card p-4">
                <h2 className="section-title text-lg mb-3">Surfaces</h2>
                <div className="flex flex-wrap gap-2">
                  {surfaces.map((s, i) => (
                    <span key={i} className="spec-chip">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-4">
              <h2 className="section-title text-lg mb-2">Documents</h2>
              <div className="space-y-2">
                {tdsHref ? (
                  <a href={tdsHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-dulux hover:underline">
                    📄 Technical Data Sheet (TDS)
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">No TDS link available</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}