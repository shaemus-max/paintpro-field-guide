import { useState, useEffect, useRef } from 'react'

/* OverrideDot — green indicator for manually overridden fields */
function OverrideDot() {
  return (
    <span
      title="Manually overridden"
      className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 shrink-0 align-middle mt-0.5"
    />
  )
}

/* ChipsEditor — for array-type fields (sheens, features, idealUses) */
function ChipsEditor({ value = [], onSave, onCancel }) {
  const [items, setItems] = useState([...value])
  const [newItem, setNewItem] = useState('')
  const inputRef = useRef(null)

  const add = () => {
    const v = newItem.trim()
    if (v && !items.includes(v)) setItems(prev => [...prev, v])
    setNewItem('')
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
          >
            {item}
            <button
              onClick={() => setItems(prev => prev.filter(x => x !== item))}
              className="text-gray-400 hover:text-red-500 transition-colors leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Add item…"
          className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux"
          autoFocus
        />
        <button onClick={add} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold transition-colors">Add</button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(items)} className="px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors">✓ Save</button>
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">✕ Cancel</button>
      </div>
    </div>
  )
}

/* Main EditableField component
   type: 'text' | 'textarea' | 'chips'
   onReset: optional callback — shown as ↺ button when isOverridden && editMode
*/
export default function EditableField({
  value,
  type = 'text',
  editMode = false,
  isOverridden = false,
  onSave,
  onReset,
  renderValue,
  className = '',
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) {
      setDraft(Array.isArray(value) ? [...value] : (value ?? ''))
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [editing])

  const handleSave = () => {
    onSave?.(draft)
    setEditing(false)
  }

  const handleCancel = () => setEditing(false)

  const handleKeyDown = e => {
    if (type !== 'textarea' && e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') handleCancel()
  }

  const displayValue = renderValue ? renderValue(value) : (Array.isArray(value) ? value.join(', ') : value)

  // ── View mode (edit mode off) ───────────────────────────────
  if (!editMode) {
    return (
      <span className={`inline-flex items-start ${className}`}>
        {isOverridden && <OverrideDot />}
        <span>{displayValue}</span>
      </span>
    )
  }

  // ── Edit mode — idle (showing value + action buttons on hover) ──
  if (!editing) {
    return (
      <span className={`inline-flex items-start gap-1 group ${className}`}>
        {isOverridden && <OverrideDot />}
        <span className="min-w-0 break-words">{displayValue}</span>
        {/* Pencil — edit */}
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 w-5 h-5 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 text-xs flex items-center justify-center transition-all ml-0.5"
          title="Edit this field"
        >
          ✏
        </button>
        {/* Reset — only when overridden */}
        {isOverridden && onReset && (
          <button
            onClick={e => { e.stopPropagation(); onReset() }}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 w-5 h-5 rounded bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs flex items-center justify-center transition-all"
            title="Reset to original value"
          >
            ↺
          </button>
        )}
      </span>
    )
  }

  // ── Chips type ─────────────────────────────────────────────
  if (type === 'chips') {
    return (
      <div className={className}>
        {isOverridden && <OverrideDot />}
        <ChipsEditor
          value={Array.isArray(value) ? value : []}
          onSave={v => { onSave?.(v); setEditing(false) }}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  // ── Textarea type ──────────────────────────────────────────
  if (type === 'textarea') {
    return (
      <div className={`space-y-2 ${className}`}>
        {isOverridden && <OverrideDot />}
        <textarea
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-brand-dulux/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux resize-none"
          rows={4}
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors">✓ Save</button>
          <button onClick={handleCancel} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">✕ Cancel</button>
        </div>
      </div>
    )
  }

  // ── Text type (default) ────────────────────────────────────
  return (
    <span className={`inline-flex items-center gap-2 w-full ${className}`}>
      {isOverridden && <OverrideDot />}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border border-brand-dulux/40 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux"
      />
      <button onClick={handleSave} className="px-2 py-1 bg-brand-dulux text-white rounded text-xs font-semibold hover:bg-red-800 shrink-0">✓</button>
      <button onClick={handleCancel} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold hover:bg-gray-200 shrink-0">✕</button>
    </span>
  )
}
