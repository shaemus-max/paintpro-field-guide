import { useState } from 'react'
import BrandBadge from './BrandBadge'

const MATCH_OPTIONS = [
  { value: 'exact',    label: 'Exact Match' },
  { value: 'close',    label: 'Close Match' },
  { value: 'category', label: 'Category Match' },
]

const EMPTY_ROW = {
  brand: '', brandDisplay: '', productName: '',
  productCode: '', matchQuality: 'close', note: '', url: '',
}

const INPUT_CLS = 'w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux'
const LABEL_CLS = 'block text-xs font-semibold text-gray-500 mb-1'

function RowEditor({ draft, onChange, onSave, onCancel }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
        {draft._isNew ? 'Add Competitor' : 'Edit Competitor'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Brand Key <span className="font-normal text-gray-400">(e.g. sw, bm, behr)</span></label>
          <input
            className={INPUT_CLS}
            value={draft.brand}
            onChange={e => onChange({ brand: e.target.value })}
            placeholder="sw"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Brand Display Name</label>
          <input
            className={INPUT_CLS}
            value={draft.brandDisplay}
            onChange={e => onChange({ brandDisplay: e.target.value })}
            placeholder="Sherwin-Williams"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Product Name</label>
          <input
            className={INPUT_CLS}
            value={draft.productName}
            onChange={e => onChange({ productName: e.target.value })}
            placeholder="Emerald Interior"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Product Code</label>
          <input
            className={INPUT_CLS}
            value={draft.productCode}
            onChange={e => onChange({ productCode: e.target.value })}
            placeholder="SW-6120"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Match Quality</label>
          <select
            className={INPUT_CLS}
            value={draft.matchQuality}
            onChange={e => onChange({ matchQuality: e.target.value })}
          >
            {MATCH_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>TDS / Product URL</label>
          <input
            className={INPUT_CLS}
            type="url"
            value={draft.url}
            onChange={e => onChange({ url: e.target.value })}
            placeholder="https://…"
          />
        </div>
      </div>
      <div>
        <label className={LABEL_CLS}>Notes</label>
        <textarea
          className={`${INPUT_CLS} resize-none`}
          value={draft.note}
          onChange={e => onChange({ note: e.target.value })}
          placeholder="e.g. Similar durability, slightly lower sheen range"
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-3 py-2 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors"
        >
          ✓ Save Row
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
        >
          ✕ Cancel
        </button>
      </div>
    </div>
  )
}

function MatchPill({ quality }) {
  const map = {
    exact:    'bg-green-100 text-green-800',
    close:    'bg-yellow-100 text-yellow-800',
    category: 'bg-gray-100 text-gray-600',
  }
  const label = MATCH_OPTIONS.find(o => o.value === quality)?.label ?? quality
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[quality] ?? map.category}`}>
      {label}
    </span>
  )
}

export default function ComparableProductsEditor({ entries = [], onSave, onCancel }) {
  const [items, setItems] = useState(entries.map(e => ({ ...e })))
  const [editingIdx, setEditingIdx] = useState(null) // null=none, -1=new row
  const [draft, setDraft] = useState(null)

  const update = changes => setDraft(prev => ({ ...prev, ...changes }))

  const startNew = () => {
    setEditingIdx(-1)
    setDraft({ ...EMPTY_ROW, _isNew: true })
  }

  const startEdit = idx => {
    setEditingIdx(idx)
    setDraft({ ...items[idx] })
  }

  const cancelRow = () => { setEditingIdx(null); setDraft(null) }

  const saveRow = () => {
    if (!draft.productName?.trim() && !draft.brand?.trim()) return
    const { _isNew, ...clean } = draft
    if (editingIdx === -1) {
      setItems(prev => [...prev, clean])
    } else {
      setItems(prev => prev.map((item, i) => i === editingIdx ? clean : item))
    }
    setEditingIdx(null)
    setDraft(null)
  }

  const deleteItem = idx => setItems(prev => prev.filter((_, i) => i !== idx))

  const moveUp = idx => {
    if (idx === 0) return
    setItems(prev => {
      const a = [...prev]
      ;[a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]
      return a
    })
  }

  const moveDown = idx => {
    setItems(prev => {
      if (idx === prev.length - 1) return prev
      const a = [...prev]
      ;[a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]
      return a
    })
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) =>
        editingIdx === idx ? (
          <RowEditor key={idx} draft={draft} onChange={update} onSave={saveRow} onCancel={cancelRow} />
        ) : (
          <div key={idx} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 pt-0.5">
                <BrandBadge brand={item.brand} size="lg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{item.productName || '(unnamed)'}</span>
                  {item.productCode && <span className="text-xs text-gray-400 font-mono">{item.productCode}</span>}
                  <MatchPill quality={item.matchQuality} />
                </div>
                {item.note && <p className="text-xs text-gray-500 leading-relaxed">{item.note}</p>}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-dulux hover:underline mt-0.5 block">
                    View ↗
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => startEdit(idx)}
                  className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(idx)}
                  className="px-2.5 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="flex-1 py-0.5 bg-gray-100 text-gray-500 rounded text-xs disabled:opacity-30 hover:bg-gray-200 transition-colors"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="flex-1 py-0.5 bg-gray-100 text-gray-500 rounded text-xs disabled:opacity-30 hover:bg-gray-200 transition-colors"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Add new row */}
      {editingIdx === -1 ? (
        <RowEditor draft={draft} onChange={update} onSave={saveRow} onCancel={cancelRow} />
      ) : (
        <button
          onClick={startNew}
          className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 hover:border-brand-dulux hover:text-brand-dulux rounded-xl text-sm font-semibold transition-colors"
        >
          + Add Competitor
        </button>
      )}

      {/* Footer actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <button
          onClick={() => onSave(items)}
          className="px-4 py-2 bg-brand-dulux text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors"
        >
          ✓ Save All Changes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          ✕ Cancel
        </button>
      </div>
    </div>
  )
}
