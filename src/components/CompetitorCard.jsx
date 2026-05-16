import { Link } from 'react-router-dom'
import BrandBadge from './BrandBadge'

function VOCChip({ voc }) {
  const map = {
    'Zero Added VOC': 'bg-green-100 text-green-800',
    'Low VOC':        'bg-blue-100 text-blue-800',
    'Regular':        'bg-gray-100 text-gray-600',
    'Solvent-based':  'bg-orange-100 text-orange-800',
  }
  const cls = map[voc] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {voc}
    </span>
  )
}

function openTds(e, url) {
  e.preventDefault()
  e.stopPropagation()
  if (url) window.open(url, '_blank')
}

export default function CompetitorCard({ product, onAddCompare, inCompare, isFav, onToggleFav }) {

  return (
    <div className="card card-hover relative flex flex-col h-full">

      {/* Image placeholder */}
      <Link to={'/competitor/' + product.id} className="block">
        <div className="w-full h-36 rounded-t-xl bg-gray-50 flex flex-col items-center justify-center">
          <span className="text-4xl opacity-20">🎨</span>
          <span className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
            {product.brandKey ? product.brandKey.toUpperCase() : ''}
          </span>
        </div>
      </Link>

      {/* Brand badge top-right */}
      <div className="absolute top-2 right-2">
        <BrandBadge brand={product.brandKey} />
      </div>

      {/* Fav button */}
      <button
        onClick={() => onToggleFav && onToggleFav(product.id)}
        className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isFav ? '❤️' : '🤍'}
      </button>

      <div className="p-4 flex flex-col flex-1">

        {/* Category tag */}
        <div className="mb-1">
          <span className="text-xs font-semibold text-brand-dulux uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Name */}
        <Link to={'/competitor/' + product.id}>
          <h3 className="font-serif text-base leading-snug text-gray-900 mb-2 hover:text-brand-dulux transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Sheens */}
        {product.sheens && product.sheens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.sheens.slice(0, 4).map(s => (
              <span key={s} className="spec-chip">{s}</span>
            ))}
            {product.sheens.length > 4 && (
              <span className="spec-chip">+{product.sheens.length - 4}</span>
            )}
          </div>
        )}

        {/* Quick specs row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 mt-auto flex-wrap">
          {product.coverage && (
            <span>📐 {product.coverage.split('(')[0].trim()}</span>
          )}
          {product.voc && <VOCChip voc={product.voc} />}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
          <Link
            to={'/competitor/' + product.id}
            className="flex-1 text-center py-2 text-xs font-semibold text-brand-dulux hover:bg-red-50 rounded-lg transition-colors"
          >
            View Details
          </Link>
          {product.tdsUrl && (
            <button
              onClick={e => openTds(e, product.tdsUrl)}
              className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              TDS
            </button>
          )}
          <button
            onClick={() => onAddCompare && onAddCompare(product.id)}
            disabled={inCompare}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              inCompare
                ? 'bg-navy text-white cursor-default'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {inCompare ? '✓ Compare' : '⊕ Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}