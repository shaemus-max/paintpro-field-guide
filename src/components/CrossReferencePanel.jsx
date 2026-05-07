import BrandBadge from './BrandBadge'
import { crossref as staticCrossref } from '../data/index'

function MatchBadge({ quality }) {
  if (quality === 'exact')  return <span className="match-badge-exact">Exact Match</span>
  if (quality === 'close')  return <span className="match-badge-close">Close Match</span>
  return <span className="match-badge-category">Category Match</span>
}

// entries prop overrides static data — pass from ProductDetailPage so overrides are reflected
export default function CrossReferencePanel({ productId, entries }) {
  const refs = entries ?? staticCrossref[productId]

  if (!refs || refs.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-400 text-sm">
        No cross-reference data for this product yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {refs.map((ref, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 pt-0.5">
              <BrandBadge brand={ref.brand} size="lg" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{ref.productName}</span>
                {ref.productCode && ref.productCode !== 'N/A' && (
                  <span className="text-xs text-gray-500 font-mono">{ref.productCode}</span>
                )}
                <MatchBadge quality={ref.matchQuality} />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{ref.note}</p>
            </div>

            {ref.url && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-gray-500 hover:text-brand-dulux transition-colors"
              >
                View ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
