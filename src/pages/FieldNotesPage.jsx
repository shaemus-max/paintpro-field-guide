import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allProducts } from '../data/index'

export default function FieldNotesPage({ allNotes, deleteNote }) {
  const [expanded, setExpanded] = useState(null)

  const entriesWithProducts = allNotes
    .map(({ productId, notes }) => ({
      product: allProducts.find(p => p.id === productId),
      productId,
      notes: notes.sort((a, b) => new Date(b.ts) - new Date(a.ts)),
    }))
    .filter(e => e.product && e.notes.length > 0)
    .sort((a, b) => new Date(b.notes[0].ts) - new Date(a.notes[0].ts))

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-gray-900">Field Notes</h1>
          <span className="text-sm text-gray-400">
            {entriesWithProducts.reduce((n, e) => n + e.notes.length, 0)} notes
          </span>
        </div>

        {entriesWithProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl mb-3">📝</p>
            <p className="text-gray-500 font-medium">No field notes yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              Open any product and tap "Field Note" to add a note
            </p>
            <Link to="/" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entriesWithProducts.map(({ product, productId, notes }) => (
              <div key={productId} className="card overflow-hidden">
                {/* Product header */}
                <button
                  onClick={() => setExpanded(expanded === productId ? null : productId)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.shortName}</p>
                    <p className="text-xs text-gray-400 capitalize">{product.brand} · {product.category}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-400 text-sm">{expanded === productId ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Notes list */}
                {expanded === productId && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {notes.map(note => (
                      <div key={note.id} className="flex items-start gap-3 p-4 bg-yellow-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(note.ts).toLocaleString('en-CA', {
                              dateStyle: 'medium', timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNote(productId, note.id)}
                          className="shrink-0 text-xs text-red-400 hover:text-red-600 transition-colors mt-0.5"
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    <div className="p-3 flex gap-2">
                      <Link
                        to={`/product/${productId}`}
                        className="btn-ghost text-xs"
                      >
                        View Product ↗
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
