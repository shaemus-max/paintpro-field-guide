import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { competitors } from '../data/index'
import BrandBadge from '../components/BrandBadge'
import EditableField from '../components/EditableField'
import PricingSection from '../components/PricingSection'
import CrossReferencePanel from '../components/CrossReferencePanel'

const CATEGORY_DEFAULTS = {
  'Interior Paint':      { idealUses: ['Living rooms', 'Bedrooms', 'Hallways', 'Offices'], surfaces: ['Drywall', 'Plaster', 'Previously painted surfaces'] },
  'Exterior Paint':      { idealUses: ['Siding', 'Trim', 'Fascia', 'Exterior wood'], surfaces: ['Wood', 'Hardboard', 'Fibre cement', 'Previously painted surfaces'] },
  'Trim & Cabinet':      { idealUses: ['Interior trim', 'Doors', 'Cabinets', 'Millwork'], surfaces: ['Wood', 'MDF', 'Previously painted surfaces'] },
  'Primer':              { idealUses: ['New drywall', 'Previously painted surfaces', 'Bare wood'], surfaces: ['Drywall', 'Wood', 'Plaster', 'Masonry'] },
  'Masonry':             { idealUses: ['Concrete block', 'Stucco', 'Brick', 'Poured concrete'], surfaces: ['Concrete', 'Masonry', 'Stucco', 'Brick'] },
  'Industrial / Protective': { idealUses: ['Steel structures', 'Concrete floors', 'Equipment', 'Tanks'], surfaces: ['Steel', 'Concrete', 'Aluminum', 'Galvanized metal'] },
  'Epoxy Coating':       { idealUses: ['Steel structures', 'Concrete floors', 'Tanks', 'Equipment'], surfaces: ['Steel', 'Concrete', 'Masonry'] },
  'Metal & Industrial':  { idealUses: ['Structural steel', 'Equipment', 'Piping', 'Tanks'], surfaces: ['Steel', 'Iron', 'Aluminum', 'Galvanized metal'] },
  'Metal & DTM':         { idealUses: ['Structural steel', 'Equipment', 'Piping'], surfaces: ['Steel', 'Iron', 'Aluminum'] },
  'Floor Coating':       { idealUses: ['Concrete floors', 'Garage floors', 'Warehouse floors'], surfaces: ['Concrete', 'Previously coated floors'] },
  'Ceiling Paint':       { idealUses: ['Interior ceilings', 'Stairwells'], surfaces: ['Drywall', 'Plaster', 'Previously painted surfaces'] },
  'Exterior Stain':      { idealUses: ['Decks', 'Fences', 'Siding', 'Exterior wood'], surfaces: ['Cedar', 'Pine', 'Pressure-treated wood', 'Weathered wood'] },
  'Interior Stain':      { idealUses: ['Interior wood trim', 'Cabinets', 'Furniture'], surfaces: ['Bare wood', 'Pine', 'Oak', 'MDF'] },
  'Specialty':           { idealUses: ['Special application surfaces'], surfaces: ['Varies by product'] },
  'Dryfall':             { idealUses: ['Ceilings in warehouses', 'Gymnasiums', 'Industrial spaces'], surfaces: ['Concrete', 'Steel', 'Drywall'] },
  'Caulk & Sealant':    { idealUses: ['Gaps around trim', 'Window and door frames', 'Expansion joints'], surfaces: ['Wood', 'Drywall', 'Masonry', 'Metal'] },
  'Zinc Rich Primer':    { idealUses: ['Structural steel', 'Bridges', 'Tanks'], surfaces: ['Blast-cleaned steel', 'Fabricated steel'] },
  'Urethane Topcoat':    { idealUses: ['Structural steel', 'Industrial equipment', 'Bridges'], surfaces: ['Primed steel', 'Epoxy-coated surfaces'] },
  'Mastic & Surface Tolerant': { idealUses: ['Maintenance painting', 'Bridges', 'Tanks'], surfaces: ['Minimally prepared steel', 'Tight rust'] },
  'Specialty Industrial': { idealUses: ['High temperature equipment', 'Stacks', 'Boilers'], surfaces: ['Steel', 'Concrete', 'Masonry'] },
  'Acrylic & DTM':       { idealUses: ['Light industrial metal', 'Equipment', 'Piping'], surfaces: ['Steel', 'Aluminum', 'Galvanized metal'] },
  'Architectural Interior': { idealUses: ['Living rooms', 'Bedrooms', 'Offices', 'Hallways'], surfaces: ['Drywall', 'Plaster', 'Previously painted surfaces'] },
  'Architectural Exterior': { idealUses: ['Siding', 'Trim', 'Fascia', 'Exterior wood'], surfaces: ['Wood', 'Hardboard', 'Fibre cement', 'Stucco'] },
}

const DEFAULT_CROSSREF = [
  {
    brand: 'sw',
    brandDisplay: 'Sherwin-Williams',
    productName: 'Emerald Urethane Trim Enamel',
    productCode: 'K38W00750',
    matchQuality: 'exact',
    note: 'Premium waterborne alkyd enamel for doors, trim, and cabinets.',
    url: 'https://www.sherwin-williams.com',
  },
  {
    brand: 'bm',
    brandDisplay: 'Benjamin Moore',
    productName: 'Advance Interior Paint',
    productCode: 'N792',
    matchQuality: 'exact',
    note: 'Market-leading waterborne alkyd for cabinetry and trim.',
    url: 'https://www.benjaminmoore.com',
  },
]

function QuickSpecTile({ icon, label, value, fieldKey, product, type = 'text', editMode, saveOverride, clearFieldOverride }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [chips, setChips] = useState([])
  const [chipIn, setChipIn] = useState('')
  const isOv = editMode && fieldKey && product?._overriddenFields?.includes(fieldKey)
  const displayVal = Array.isArray(value) ? value.join(', ') : value
  if (!displayVal && !editMode) return null
  const startEdit = () => {
    if (!editMode || !fieldKey) return
    if (type === 'chips') setChips(Array.isArray(value) ? [...value] : [])
    else setDraft(value ?? '')
    setEditing(true)
  }
  const handleSave = () => {
    saveOverride?.(product.id, { [fieldKey]: type === 'chips' ? chips : draft })
    setEditing(false)
  }
  const addChip = () => {
    const v = chipIn.trim()
    if (v && !chips.includes(v)) setChips(p => [...p, v])
    setChipIn('')
  }
  if (editing) {
    return (
      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 shrink-0" style={{ minWidth: type === 'chips' ? 200 : 140 }}>
        <p className="text-xs font-semibold text-amber-800 mb-2">{icon} {label}</p>
        {type === 'chips' ? (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {chips.map(c => (
                <span key={c} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700">
                  {c}<button onClick={() => setChips(p => p.filter(x => x !== c))} className="text-gray-400 hover:text-red-500 leading-none ml-1">x</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1 mb-2">
              <input type="text" value={chipIn} onChange={e => setChipIn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip() } }} placeholder="Add" autoFocus className="flex-1 min-w-0 border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-dulux" />
              <button onClick={addChip} className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold hover:bg-gray-200">+</button>
            </div>
          </>
        ) : (
          <input type="text" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }} className="w-full border border-brand-dulux/40 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux mb-2" />
        )}
        <div className="flex gap-1 flex-wrap">
          <button onClick={handleSave} className="px-2 py-1 bg-brand-dulux text-white rounded text-xs font-semibold hover:bg-red-800">Save</button>
          <button onClick={() => setEditing(false)} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold hover:bg-gray-200">X</button>
          {isOv && <button onClick={() => { clearFieldOverride?.(product.id, fieldKey); setEditing(false) }} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold hover:bg-orange-200">Reset</button>}
        </div>
      </div>
    )
  }
  return (
    <div className={`bg-gray-50 rounded-xl p-3 text-center min-w-[100px] relative group shrink-0 ${editMode && fieldKey ? 'hover:bg-amber-50 cursor-pointer' : ''}`} onClick={startEdit}>
      {isOv && <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-green-500" />}
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="text-xs text-gray-500 font-medium mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900 leading-tight">{displayVal || (editMode ? <span className="text-gray-300 text-xs">—</span> : null)}</div>
      {editMode && fieldKey && <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs text-blue-400">edit</span></div>}
    </div>
  )
}

function SpecRow({ label, value, fieldKey, product, type = 'text', editMode, saveOverride, clearFieldOverride }) {
  const val = fieldKey ? product[fieldKey] : value
  const isOv = product._overriddenFields?.includes(fieldKey)
  const displayVal = Array.isArray(val) ? val.join(' · ') : val
  if (!displayVal && !editMode) return null
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      {editMode && fieldKey ? (
        <EditableField value={val ?? (type === 'chips' ? [] : '')} type={type} editMode={editMode} isOverridden={isOv} onSave={v => saveOverride(product.id, { [fieldKey]: v })} onReset={isOv ? () => clearFieldOverride(product.id, fieldKey) : undefined} className="spec-value" />
      ) : (
        <span className="spec-value">{displayVal}</span>
      )}
    </div>
  )
}

function openTds(url) {
  if (url) window.open(url, '_blank')
}

export default function CompetitorDetailPage({
  favs = [], onToggleFav, onAddCompare, inCompare,
  addNote, getNotes, deleteNote,
  editMode = false, saveOverride, clearFieldOverride,
  onDeleteProduct,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const baseProduct = competitors.find(p => p.id === id)
  const [overrides, setOverrides] = useState({})
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [editingDocs, setEditingDocs] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!baseProduct) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/" className="text-brand-dulux text-sm mt-3 inline-block hover:underline">Back to search</Link>
      </div>
    )
  }

  const product = {
    ...baseProduct,
    priceGallon:  baseProduct.priceGallon  || '75.00',
    price5Gallon: baseProduct.price5Gallon || '320.00',
    ...overrides,
    _overriddenFields: Object.keys(overrides),
  }

  const isFav = favs.includes(product.id)
  const defaults = CATEGORY_DEFAULTS[product.category] || { idealUses: [], surfaces: [] }
  const idealUses = product.idealUses?.length > 0 ? product.idealUses : defaults.idealUses
  const surfaces  = product.surfaces?.length  > 0 ? product.surfaces  : defaults.surfaces
  const tdsHref   = product.tdsUrl
  const notes     = getNotes ? getNotes(product.id) : []

  const handleSaveOverride = (pid, updates) => {
    setOverrides(prev => ({ ...prev, ...updates }))
    if (saveOverride) saveOverride(pid, updates)
  }

  const handleClearOverride = (pid, field) => {
    setOverrides(prev => { const n = { ...prev }; delete n[field]; return n })
    if (clearFieldOverride) clearFieldOverride(pid, field)
  }

  const ov = field => overrides.hasOwnProperty(field)

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    addNote && addNote(product.id, product.name, noteText.trim())
    setNoteText('')
    setShowNoteForm(false)
  }

  const handleDelete = () => {
    onDeleteProduct && onDeleteProduct(product)
    navigate('/')
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
          {editMode && <span className="ml-auto text-amber-600 font-semibold">Edit Mode</span>}
        </div>
      </div>

      <div className="page-container py-6">

        {editMode && (
          <div className="mb-4 flex justify-end">
            {confirmDelete ? (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <span className="text-sm text-red-700 font-medium">Delete this product permanently?</span>
                <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">Yes, Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                🗑 Delete Product
              </button>
            )}
          </div>
        )}

        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-48 sm:shrink-0">
              <div className="w-full h-48 sm:h-44 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                <span className="text-5xl opacity-20">🎨</span>
                <span className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wide">{product.brandKey ? product.brandKey.toUpperCase() : ''}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <BrandBadge brand={product.brandKey} size="lg" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">{product.category}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 leading-tight mb-2">
                <EditableField value={product.name} type="text" editMode={editMode} isOverridden={ov('name')} onSave={v => handleSaveOverride(product.id, { name: v })} onReset={ov('name') ? () => handleClearOverride(product.id, 'name') : undefined} />
              </h1>
              {product.code && <p className="text-xs text-gray-400 font-mono mb-3">SKU: {product.code}</p>}
              <div className="text-sm text-gray-600 leading-relaxed mb-4">
                <EditableField value={product.description || ''} type="textarea" editMode={editMode} isOverridden={ov('description')} onSave={v => handleSaveOverride(product.id, { description: v })} onReset={ov('description') ? () => handleClearOverride(product.id, 'description') : undefined} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onToggleFav && onToggleFav(product.id)} className={'btn-secondary ' + (isFav ? 'text-red-600 bg-red-50 hover:bg-red-100' : '')}>{isFav ? '❤️ Saved' : '🤍 Save'}</button>
                <button onClick={() => onAddCompare && onAddCompare(product.id)} disabled={inCompare && inCompare(product.id)} className={inCompare && inCompare(product.id) ? 'btn-secondary opacity-60' : 'btn-secondary'}>{inCompare && inCompare(product.id) ? '✓ In Compare' : '⊕ Compare'}</button>
                <button onClick={() => setShowNoteForm(!showNoteForm)} className="btn-secondary">📝 Field Note</button>
                {tdsHref && <button onClick={() => openTds(tdsHref)} className="btn-ghost">TDS</button>}
              </div>
            </div>
          </div>
        </div>

        {showNoteForm && (
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add Field Note</h3>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="e.g. Customer uses this on commercial jobs." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-dulux" rows={3} autoFocus />
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
                    <span className="text-xs text-gray-400">{new Date(note.ts).toLocaleDateString('en-CA')}</span>
                    <button onClick={() => deleteNote && deleteNote(product.id, note.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
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
                <QuickSpecTile icon="✨" label="Sheens" fieldKey="sheens" value={product.sheens} product={product} type="chips" editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <QuickSpecTile icon="📐" label="Coverage" fieldKey="coverage" value={product.coverage} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <QuickSpecTile icon="🌿" label="VOC" fieldKey="voc" value={product.voc} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <QuickSpecTile icon="⏰" label="Touch Dry" fieldKey="touchDry" value={product.touchDry} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <QuickSpecTile icon="🔄" label="Recoat" fieldKey="recoat" value={product.recoat} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <QuickSpecTile icon="📏" label="Film Thick" fieldKey="filmThickness" value={product.filmThickness} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg">Technical Data</h2>
              <div className="divide-y divide-gray-100">
                <SpecRow label="Sheens" fieldKey="sheens" value={product.sheens} product={product} type="chips" editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Coverage" fieldKey="coverage" value={product.coverage} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="VOC" fieldKey="voc" value={product.voc} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Touch Dry" fieldKey="touchDry" value={product.touchDry} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Recoat" fieldKey="recoat" value={product.recoat} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Film Thickness" fieldKey="filmThickness" value={product.filmThickness} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Sizes" fieldKey="sizes" value={product.sizes} product={product} type="chips" editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
                <SpecRow label="Product Code" fieldKey="code" value={product.code} product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-2">Description</h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                <EditableField value={product.description || ''} type="textarea" editMode={editMode} isOverridden={ov('description')} onSave={v => handleSaveOverride(product.id, { description: v })} onReset={ov('description') ? () => handleClearOverride(product.id, 'description') : undefined} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('features') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Features & Benefits
                {ov('features') && editMode && <button onClick={() => handleClearOverride(product.id, 'features')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.features ?? []} type="chips" editMode={editMode} isOverridden={ov('features')} onSave={v => handleSaveOverride(product.id, { features: v })} />
              ) : product.features?.length > 0 ? (
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-dulux mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No features listed yet.</p>
              )}
            </div>

          </div>

          <div className="space-y-6">

            <PricingSection product={product} editMode={editMode} saveOverride={handleSaveOverride} clearFieldOverride={handleClearOverride} />

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('idealUses') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Ideal Uses
                {ov('idealUses') && editMode && <button onClick={() => handleClearOverride(product.id, 'idealUses')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.idealUses ?? idealUses} type="chips" editMode={editMode} isOverridden={ov('idealUses')} onSave={v => handleSaveOverride(product.id, { idealUses: v })} />
              ) : (
                <ul className="space-y-1.5">
                  {idealUses.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dulux shrink-0" />{u}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('surfaces') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Surfaces
                {ov('surfaces') && editMode && <button onClick={() => handleClearOverride(product.id, 'surfaces')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.surfaces ?? surfaces} type="chips" editMode={editMode} isOverridden={ov('surfaces')} onSave={v => handleSaveOverride(product.id, { surfaces: v })} />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {surfaces.map((s, i) => <span key={i} className="spec-chip">{s}</span>)}
                </div>
              )}
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="section-title text-lg">Documents</h2>
                {editMode && !editingDocs && <button onClick={() => setEditingDocs(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Edit URLs</button>}
              </div>
              {editingDocs ? (
                <div className="space-y-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">TDS URL</label>
                    <input type="url" defaultValue={product.tdsUrl || ''} onBlur={e => handleSaveOverride(product.id, { tdsUrl: e.target.value })} placeholder="Paste TDS URL" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux bg-white" />
                  </div>
                  <button onClick={() => setEditingDocs(false)} className="px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800">Done</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {tdsHref ? (
                    <button onClick={() => openTds(tdsHref)} className="flex items-center gap-2 text-sm text-brand-dulux hover:underline">
                      📄 Technical Data Sheet (TDS)
                    </button>
                  ) : <p className="text-sm text-gray-400">No TDS link available</p>}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl text-gray-900 mb-4">Comparable Products from Other Brands</h2>
          <CrossReferencePanel productId={product.id} entries={DEFAULT_CROSSREF} />
        </div>

      </div>
    </div>
  )
}