import { useParams, Link } from 'react-router-dom'
import { competitors } from '../data/index'
import BrandBadge from '../components/BrandBadge'

function SpecTile({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
    </div>
  )
}

export default function CompetitorDetailPage() {
  const { id } = useParams()
  const product = competitors.find(p => p.id === id)

  if (!product) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-gray-500">Competitor product not found.</p>
        <Link to="/" className="text-brand-dulux text-sm mt-3 inline-block hover:underline">
          ← Back to search
        </Link>
      </div>
    )
  }

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-4 sm:py-6 max-w-3xl mx-auto">

        <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 mb-4">
          ← Back
        </Link>

        {/* Competitor notice */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2.5 text-sm mb-5 flex items-center gap-2">
          <span>⚠️</span>
          <span>This is a competitor product — not sold by your brands.</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <BrandBadge brand={product.brandKey} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {product.code && (
                <span className="font-mono text-sm text-gray-400">{product.code}</span>
              )}
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
        )}

        {/* Quick specs grid */}
        {(product.sheens?.length > 0 || product.voc || product.coverage ||
          product.touchDry || product.recoat || product.filmThickness) && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Specs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.sheens?.length > 0 && (
                <SpecTile label="Sheens" value={product.sheens.join(', ')} />
              )}
              {product.voc && <SpecTile label="VOC" value={product.voc} />}
              {product.coverage && <SpecTile label="Coverage" value={product.coverage} />}
              {product.touchDry && <SpecTile label="Touch Dry" value={product.touchDry} />}
              {product.recoat && <SpecTile label="Recoat" value={product.recoat} />}
              {product.filmThickness && <SpecTile label="Film Thickness" value={product.filmThickness} />}
            </div>
          </div>
        )}

        {/* Available sizes */}
        {product.sizes?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Available Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <span key={s} className="spec-chip">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* TDS link */}
        {product.tdsUrl && (
          <a
            href={product.tdsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors"
          >
            View Technical Data Sheet ↗
          </a>
        )}
      </div>
    </div>
  )
}
