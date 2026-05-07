import { Link } from 'react-router-dom'
import BrandBadge from './BrandBadge'

export default function CompetitorCard({ product }) {
  return (
    <Link
      to={`/competitor/${product.id}`}
      className="card p-4 flex flex-col gap-2 h-full hover:border-brand-dulux hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <BrandBadge brand={product.brandKey} size="sm" />
        <span className="text-xs text-gray-400 capitalize">{product.category}</span>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>

      {product.code && (
        <p className="text-xs text-gray-400 font-mono">{product.code}</p>
      )}

      {product.description && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">{product.description}</p>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-auto">
        {product.voc && (
          <span>VOC: <span className="font-medium text-gray-700">{product.voc}</span></span>
        )}
        {product.coverage && (
          <span>Cov: <span className="font-medium text-gray-700">{product.coverage}</span></span>
        )}
      </div>

      {product.sheens?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.sheens.slice(0, 4).map(s => (
            <span key={s} className="spec-chip">{s}</span>
          ))}
          {product.sheens.length > 4 && (
            <span className="spec-chip">+{product.sheens.length - 4}</span>
          )}
        </div>
      )}

      {product.tdsUrl && (
        <span className="text-xs font-semibold text-brand-dulux">TDS ↗</span>
      )}
    </Link>
  )
}
