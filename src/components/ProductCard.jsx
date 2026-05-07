import { Link } from 'react-router-dom'
import BrandBadge from './BrandBadge'
import ProductImage from './ProductImage'
import { PricingDisplay } from './PricingSection'

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

export default function ProductCard({ product, onAddCompare, inCompare, isFav, onToggleFav }) {
  const hasPricing = product.priceQuart || product.priceGallon || product.price5Gallon

  return (
    <div className="card card-hover relative flex flex-col h-full">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage
          product={product}
          className="w-full h-36 rounded-t-xl"
        />
      </Link>

      {/* Brand badge top-right */}
      <div className="absolute top-2 right-2">
        <BrandBadge brand={product.brand} />
      </div>

      {/* Fav button */}
      <button
        onClick={() => onToggleFav?.(product.id)}
        className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isFav ? '❤️' : '🤍'}
      </button>

      <div className="p-4 flex flex-col flex-1">
        {/* Category tag */}
        <div className="mb-1">
          <span className="text-xs font-semibold text-brand-dulux uppercase tracking-wide">
            {product.subcategory || product.category}
          </span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-base leading-snug text-gray-900 mb-2 hover:text-brand-dulux transition-colors line-clamp-2">
            {product.shortName}
          </h3>
        </Link>

        {/* Sheens */}
        {product.sheens?.length > 0 && (
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
            <span title="Coverage">📐 {product.coverage.split('(')[0].trim()}</span>
          )}
          {product.voc && <VOCChip voc={product.voc} />}
        </div>

        {/* Pricing — shown when prices are set */}
        {hasPricing && (
          <div className="mb-2 pt-1.5 border-t border-gray-100">
            <PricingDisplay product={product} compact />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center py-2 text-xs font-semibold text-brand-dulux hover:bg-red-50 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <a
            href={product.duluxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open TDS on dulux.ca"
          >
            TDS ↗
          </a>
          <button
            onClick={() => onAddCompare?.(product.id)}
            disabled={inCompare}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              inCompare
                ? 'bg-navy text-white cursor-default'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Add to compare"
          >
            {inCompare ? '✓ Compare' : '⊕ Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}
