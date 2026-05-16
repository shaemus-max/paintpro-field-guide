import { Link } from 'react-router-dom'
import BrandBadge from './BrandBadge'

export default function CompetitorCard({ product, favs = [], onToggleFav, onAddCompare, inCompare }) {
  const isFav = favs.includes(product.id)

  function openTds(e) {
    e.preventDefault()
    e.stopPropagation()
    if (product.tdsUrl) window.open(product.tdsUrl, '_blank')
  }

  function toggleFav(e) {
    e.preventDefault()
    if (onToggleFav) onToggleFav(product.id)
  }

  function addToCompare(e) {
    e.preventDefault()
    if (onAddCompare) onAddCompare(product.id)
  }

  return (
    <div className="card p-4 flex flex-col gap-2 h-full hover:border-brand-dulux hover:shadow-sm transition-all relative">

      <button
        onClick={toggleFav}
        className="absolute top-3 left-3 z-10 text-lg leading-none"
      >
        {isFav ? '❤️' : '🤍'}
      </button>

      <div className="flex justify-end">
        <BrandBadge brand={product.brandKey} size="sm" />
      </div>

      <div className="w-full h-28 bg-gray-50 rounded-xl flex flex-col items-center justify-center mb-1">
        <span className="text-4xl opacity-20">🎨</span>
        <span className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
          {product.brandKey ? product.brandKey.toUpperCase() : ''}
        </span>
      </div>

      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {product.category}
      </span>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>

      {product.code && (
        <p className="text-xs text-gray-400 font-mono">{product.code}</p>
      )}

      {product.description && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-auto">
        {product.voc && (
          <span>VOC: <span className="font-medium text-gray-700">{product.voc}</span></span>
        )}
        {product.coverage && (
          <span>Cov: <span className="font-medium text-gray-700">{product.coverage}</span></span>
        )}
      </div>

      {product.sheens && product.sheens.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.sheens.slice(0, 4).map(s => (
            <span key={s} className="spec-chip">{s}</span>
          ))}
          {product.sheens.length > 4 && (
            <span className="spec-chip">+{product.sheens.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-1">
        <Link
          to={'/competitor/' + product.id}
          className="flex-1 text-center text-xs font-semibold text-white bg-navy px-3 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          View Details
        </Link>
        {product.tdsUrl && (
          <button
            onClick={openTds}
            className="text-xs font-semibold text-brand-dulux px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            TDS
          </button>
        )}
        <button
          onClick={addToCompare}
          disabled={inCompare && inCompare(product.id)}
          className="text-xs font-semibold text-gray-500 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Compare
        </button>
      </div>
    </div>
  )
}