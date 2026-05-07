import BrandBadge from './BrandBadge'

export default function CompetitorCard({ product }) {
  return (
    <div className="card p-4 flex flex-col gap-2 h-full">
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
          {product.sheens.map(s => (
            <span key={s} className="spec-chip">{s}</span>
          ))}
        </div>
      )}

      {product.tdsUrl && (
        <a
          href={product.tdsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-brand-dulux hover:underline"
        >
          TDS ↗
        </a>
      )}
    </div>
  )
}
