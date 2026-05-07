import BrandBadge from './BrandBadge'
import { crossref as staticCrossref, competitors } from '../data/index'

function MatchBadge({ quality }) {
  if (quality === 'exact')  return <span className="match-badge-exact">Exact Match</span>
  if (quality === 'close')  return <span className="match-badge-close">Close Match</span>
  return <span className="match-badge-category">Category Match</span>
}

// Try to find matching competitor product by brand key + code or first word of name
function findCompetitor(brand, productCode, productName) {
  const firstWord = productName.replace(/[®™]/g, '').trim().split(' ')[0].toLowerCase()
  return competitors.find(c =>
    c.brandKey === brand && (
      (productCode && productCode !== 'N/A' && c.code === productCode) ||
      c.name.replace(/[®™]/g, '').toLowerCase().includes(firstWord)
    )
  )
}

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
      {refs.map((ref, i) => {
        const comp = findCompetitor(ref.brand, ref.productCode, ref.productName)
        const tdsLink = comp?.tdsUrl || ref.url

        return (
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

                {/* Enriched specs from competitors.json */}
                {comp && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {comp.voc && (
                      <span className="text-xs text-gray-500">VOC: <span className="font-medium text-gray-700">{comp.voc}</span></span>
                    )}
                    {comp.coverage && (
                      <span className="text-xs text-gray-500">Coverage: <span className="font-medium text-gray-700">{comp.coverage}</span></span>
                    )}
                    {comp.sheens?.length > 0 && (
                      <span className="text-xs text-gray-500">Sheens: <span className="font-medium text-gray-700">{comp.sheens.join(', ')}</span></span>
                    )}
                    {comp.touchDry && (
                      <span className="text-xs text-gray-500">Touch Dry: <span className="font-medium text-gray-700">{comp.touchDry}</span></span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {tdsLink && (
                  <a
                    href={tdsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-gray-500 hover:text-brand-dulux transition-colors whitespace-nowrap"
                  >
                    TDS ↗
                  </a>
                )}
                {ref.url && comp?.tdsUrl && ref.url !== comp.tdsUrl && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-brand-dulux transition-colors whitespace-nowrap"
                  >
                    View ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
