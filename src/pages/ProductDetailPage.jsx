import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { crossref as staticCrossref } from '../data/index'
import BrandBadge from '../components/BrandBadge'
import ProductImage from '../components/ProductImage'
import CrossReferencePanel from '../components/CrossReferencePanel'
import ComparableProductsEditor from '../components/ComparableProductsEditor'
import EditableField from '../components/EditableField'
import PricingSection from '../components/PricingSection'

function QuickSpecTile({ icon, label, value, fieldKey, product, type = 'text', editMode, saveOverride, clearFieldOverride }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [chips, setChips] = useState([])
  const [chipIn, setChipIn] = useState('')
  const inputRef = useRef(null)
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
    const payload = type === 'chips' ? chips : draft
    saveOverride?.(product.id, { [fieldKey]: payload })
    setEditing(false)
  }
  const addChip = () => {
    const v = chipIn.trim()
    if (v && !chips.includes(v)) setChips(p => [...p, v])
    setChipIn('')
    inputRef.current?.focus()
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
                  {c}
                  <button onClick={() => setChips(p => p.filter(x => x !== c))} className="text-gray-400 hover:text-red-500 leading-none ml-1">x</button>
                </span>
              ))}
            </div>
            <div className="flex gap-1 mb-2">
              <input ref={inputRef} type="text" value={chipIn} onChange={e => setChipIn(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip() } }} placeholder="Add" autoFocus className="flex-1 min-w-0 border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-dulux" />
              <button onClick={addChip} className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold hover:bg-gray-200">+</button>
            </div>
          </>
        ) : (
          <input ref={inputRef} type="text" value={draft} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }} className="w-full border border-brand-dulux/40 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux mb-2" />
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

function SpecRow({ label, fieldKey, product, type = 'text', editMode, saveOverride, clearFieldOverride }) {
  const value = product[fieldKey]
  const isOv = product._overriddenFields?.includes(fieldKey)
  const displayVal = Array.isArray(value) ? value.join(' · ') : value
  if (!displayVal && !editMode) return null
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <EditableField value={value ?? (type === 'chips' ? [] : '')} type={type} editMode={editMode} isOverridden={isOv} onSave={v => saveOverride(product.id, { [fieldKey]: v })} onReset={isOv ? () => clearFieldOverride(product.id, fieldKey) : undefined} className="spec-value" />
    </div>
  )
}

function ImageEditor({ productId, currentUrl, saveOverride, clearFieldOverride }) {
  const [urlDraft, setUrlDraft] = useState('')
  const fileRef = useRef(null)
  const handleUrlSave = () => {
    const url = urlDraft.trim()
    if (!url) return
    saveOverride(productId, { imageUrl: url })
    setUrlDraft('')
  }
  const handleFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => saveOverride(productId, { imageUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  return (
    <div className="mt-2 space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <p className="text-xs font-semibold text-amber-800">Edit Image</p>
      <div className="flex gap-2">
        <input type="url" value={urlDraft} onChange={e => setUrlDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUrlSave()} placeholder="Paste image URL" className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-dulux bg-white" />
        <button onClick={handleUrlSave} className="px-2.5 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800">Set</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">Upload Photo</button>
        {currentUrl && <button onClick={() => clearFieldOverride(productId, 'imageUrl')} className="px-2.5 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Clear Image</button>}
      </div>
    </div>
  )
}

function DocsEditor({ product, saveOverride, clearFieldOverride, onClose }) {
  const [tds, setTds] = useState(product.tdsUrl || '')
  const [sds, setSds] = useState(product.sdsUrl || '')
  const handleSave = () => {
    saveOverride(product.id, { tdsUrl: tds.trim() || null, sdsUrl: sds.trim() || null })
    onClose()
  }
  const handleReset = () => {
    clearFieldOverride(product.id, 'tdsUrl')
    clearFieldOverride(product.id, 'sdsUrl')
    onClose()
  }
  const tdsOv = product._overriddenFields?.includes('tdsUrl')
  const sdsOv = product._overriddenFields?.includes('sdsUrl')
  return (
    <div className="mt-3 space-y-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">TDS URL {tdsOv && <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1" />}</label>
        <input type="url" value={tds} onChange={e => setTds(e.target.value)} placeholder="Paste TDS URL" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux bg-white" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">SDS URL {sdsOv && <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1" />}</label>
        <input type="url" value={sds} onChange={e => setSds(e.target.value)} placeholder="Paste SDS URL" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux bg-white" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={handleSave} className="px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800">Save</button>
        <button onClick={onClose} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200">Cancel</button>
        {(tdsOv || sdsOv) && <button onClick={handleReset} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-200">Reset</button>}
      </div>
    </div>
  )
}

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

export default function ProductDetailPage({
  favs, onToggleFav, compareList, onAddCompare, inCompare,
  addNote, getNotes, deleteNote,
  editMode = false,
  getProduct,
  saveOverride,
  clearFieldOverride,
  onDeleteProduct,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct ? getProduct(id) : null
  const [noteText, setNoteText] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingCrossref, setEditingCrossref] = useState(false)
  const [editingDocs, setEditingDocs] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!product) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-gray-400 text-lg mb-4">Product not found</p>
        <Link to="/" className="btn-primary">Back to Search</Link>
      </div>
    )
  }

  const isFav = favs.includes(product.id)
  const notes = getNotes(product.id)
  const save = updates => saveOverride?.(product.id, updates)
  const reset = field => clearFieldOverride?.(product.id, field)
  const ov = field => product._overriddenFields?.includes(field)
  const effectiveCrossref = product.crossref ?? staticCrossref[product.id]
  const defaults = CATEGORY_DEFAULTS[product.category] || { idealUses: [], surfaces: [] }
  const idealUses = product.idealUses?.length > 0 ? product.idealUses : defaults.idealUses
  const surfaces = product.surfaces?.length > 0 ? product.surfaces : defaults.surfaces
  const tdsHref = product.tdsUrl || product.duluxUrl
  const sdsHref = product.sdsUrl

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    addNote(product.id, product.shortName, noteText.trim())
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
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.shortName}</span>
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
              <ProductImage product={product} className="w-full h-48 sm:h-44 rounded-xl" />
              {editMode && <ImageEditor productId={product.id} currentUrl={product.imageUrl} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <BrandBadge brand={product.brand} size="lg" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">{product.subcategory || product.category}</span>
                {product.voc === 'Zero Added VOC' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">Zero VOC</span>}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 leading-tight mb-2">
                <EditableField value={product.name} type="text" editMode={editMode} isOverridden={ov('name')} onSave={v => save({ name: v, shortName: v })} onReset={ov('name') ? () => { reset('name'); reset('shortName') } : undefined} />
              </h1>
              {product.productCode && <p className="text-xs text-gray-400 font-mono mb-3">SKU: {product.productCode}</p>}
              <div className="text-sm text-gray-600 leading-relaxed mb-4">
                <EditableField value={product.description} type="textarea" editMode={editMode} isOverridden={ov('description')} onSave={v => save({ description: v })} onReset={ov('description') ? () => reset('description') : undefined} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onToggleFav(product.id)} className={'btn-secondary ' + (isFav ? 'text-red-600 bg-red-50 hover:bg-red-100' : '')}>{isFav ? '❤️ Saved' : '🤍 Save'}</button>
                <button onClick={() => onAddCompare(product.id)} disabled={inCompare(product.id)} className={inCompare(product.id) ? 'btn-secondary opacity-60' : 'btn-secondary'}>{inCompare(product.id) ? '✓ In Compare' : '⊕ Compare'}</button>
                <button onClick={() => setShowNoteForm(!showNoteForm)} className="btn-secondary">📝 Field Note</button>
                {tdsHref && <a href={tdsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">TDS</a>}
                {sdsHref && <a href={sdsHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">SDS</a>}
              </div>
            </div>
          </div>
        </div>

        {showNoteForm && (
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add Field Note</h3>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="e.g. Good coverage on new drywall. Customer prefers Satin." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-dulux" rows={3} autoFocus />
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
                    <button onClick={() => deleteNote(product.id, note.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
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
                <QuickSpecTile icon="✨" label="Sheens" fieldKey="sheens" value={product.sheens} product={product} type="chips" editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="📐" label="Coverage" fieldKey="coverage" value={product.coverage} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="🌿" label="VOC" fieldKey="voc" value={product.voc || product.vocLevel} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="⏰" label="Touch Dry" fieldKey="touchDry" value={product.touchDry} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="🔄" label="Recoat" fieldKey="recoat" value={product.recoat} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="📏" label="Film (Wet)" fieldKey="filmThicknessWet" value={product.filmThicknessWet} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="📐" label="Film (Dry)" fieldKey="filmThicknessDry" value={product.filmThicknessDry} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <QuickSpecTile icon="🧪" label="Finish" fieldKey="finish" value={product.finish} product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg">Technical Data</h2>
              <div className="divide-y divide-gray-100">
                <SpecRow label="Sheens" fieldKey="sheens" product={product} type="chips" editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Coverage" fieldKey="coverage" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="VOC" fieldKey="voc" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Touch Dry" fieldKey="touchDry" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Recoat" fieldKey="recoat" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Film (Wet)" fieldKey="filmThicknessWet" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Film (Dry)" fieldKey="filmThicknessDry" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Finish Type" fieldKey="finish" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Bases" fieldKey="bases" product={product} type="chips" editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Sizes" fieldKey="sizes" product={product} type="chips" editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
                <SpecRow label="Product Code" fieldKey="productCode" product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-2">Description</h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                <EditableField value={product.description} type="textarea" editMode={editMode} isOverridden={ov('description')} onSave={v => save({ description: v })} onReset={ov('description') ? () => reset('description') : undefined} />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('features') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Features & Benefits
                {ov('features') && editMode && <button onClick={() => reset('features')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.features ?? []} type="chips" editMode={editMode} isOverridden={ov('features')} onSave={v => save({ features: v })} />
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

            <PricingSection product={product} editMode={editMode} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} />

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('idealUses') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Ideal Uses
                {ov('idealUses') && editMode && <button onClick={() => reset('idealUses')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.idealUses ?? []} type="chips" editMode={editMode} isOverridden={ov('idealUses')} onSave={v => save({ idealUses: v })} />
              ) : idealUses.length > 0 ? (
                <ul className="space-y-1.5">
                  {idealUses.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-dulux shrink-0" />{u}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No ideal uses listed yet.</p>
              )}
            </div>

            <div className="card p-4">
              <h2 className="section-title text-lg mb-3 flex items-center gap-1.5">
                {ov('surfaces') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                Surfaces
                {ov('surfaces') && editMode && <button onClick={() => reset('surfaces')} className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>}
              </h2>
              {editMode ? (
                <EditableField value={product.surfaces ?? []} type="chips" editMode={editMode} isOverridden={ov('surfaces')} onSave={v => save({ surfaces: v })} />
              ) : surfaces.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {surfaces.map((s, i) => <span key={i} className="spec-chip">{s}</span>)}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No surfaces listed yet.</p>
              )}
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="section-title text-lg">Documents</h2>
                {editMode && !editingDocs && <button onClick={() => setEditingDocs(true)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Edit URLs</button>}
              </div>
              {editingDocs ? (
                <DocsEditor product={product} saveOverride={saveOverride} clearFieldOverride={clearFieldOverride} onClose={() => setEditingDocs(false)} />
              ) : (
                <div className="space-y-2">
                  {tdsHref ? (
                    <a href={tdsHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-dulux hover:underline">
                      {ov('tdsUrl') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                      📄 Technical Data Sheet (TDS)
                    </a>
                  ) : <p className="text-sm text-gray-400">No TDS link available</p>}
                  {sdsHref && (
                    <a href={sdsHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-dulux hover:underline">
                      {ov('sdsUrl') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                      📋 Safety Data Sheet (SDS)
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl text-gray-900">
              Comparable Products from Other Brands
              {ov('crossref') && <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-2 align-middle" />}
            </h2>
            {editMode && !editingCrossref && (
              <button onClick={() => setEditingCrossref(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-200 transition-colors">
                Edit Competitors
              </button>
            )}
            {editMode && ov('crossref') && !editingCrossref && (
              <button onClick={() => reset('crossref')} className="ml-2 text-xs font-semibold text-orange-600 hover:text-orange-800">Reset</button>
            )}
          </div>
          {editingCrossref ? (
            <ComparableProductsEditor entries={effectiveCrossref ?? []} onSave={entries => { save({ crossref: entries }); setEditingCrossref(false) }} onCancel={() => setEditingCrossref(false)} />
          ) : (
            <CrossReferencePanel productId={product.id} entries={effectiveCrossref} />
          )}
        </div>

      </div>
    </div>
  )
}