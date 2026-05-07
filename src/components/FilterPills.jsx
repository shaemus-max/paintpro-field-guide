import { CATEGORIES, BRANDS } from '../data/index'

export default function FilterPills({ activeCategory, onCategory, activeBrand, onBrand, counts }) {
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

      {/* Brand toggle */}
      <div className="flex gap-2">
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
    </div>
  )
}
