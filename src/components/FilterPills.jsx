import { CATEGORIES, BRANDS, COMPETITOR_BRANDS } from '../data/index'

const COMPETITOR_IDS = new Set(COMPETITOR_BRANDS.map(b => b.id))

export default function FilterPills({ activeCategory, onCategory, activeBrand, onBrand, counts }) {
  const competitorActive = COMPETITOR_IDS.has(activeBrand)

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onCategory(id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === id
                ? 'bg-brand-dulux text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-dulux hover:text-brand-dulux'
            }`}
          >
            {label}
            {counts?.[id] != null && (
              <span className={`ml-1.5 text-xs ${activeCategory === id ? 'text-red-200' : 'text-gray-400'}`}>
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Our brand pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium pr-1">Our lines:</span>
        {BRANDS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onBrand(id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              activeBrand === id
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Competitor brand pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-medium pr-1">Competitors:</span>
        {COMPETITOR_BRANDS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onBrand(activeBrand === id ? 'all' : id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              activeBrand === id
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
            }`}
          >
            {label}
            {counts?.[id] != null && (
              <span className={`ml-1.5 ${activeBrand === id ? 'text-gray-300' : 'text-gray-400'}`}>
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
