import { useMemo } from 'react'
import Fuse from 'fuse.js'
import FilterPills from '../components/FilterPills'
import ProductCard from '../components/ProductCard'
import CompetitorCard from '../components/CompetitorCard'
import { competitors, COMPETITOR_BRANDS } from '../data/index'

const COMPETITOR_IDS = new Set(COMPETITOR_BRANDS.map(b => b.id))

const FUSE_OPTS = {
  keys: [
    { name: 'name',        weight: 0.4 },
    { name: 'shortName',   weight: 0.4 },
    { name: 'productCode', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'category',    weight: 0.1 },
    { name: 'subcategory', weight: 0.1 },
    { name: 'brand',       weight: 0.1 },
    { name: 'features',    weight: 0.05 },
    { name: 'idealUses',   weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
}

const COMPETITOR_FUSE_OPTS = {
  keys: [
    { name: 'name',        weight: 0.5 },
    { name: 'code',        weight: 0.3 },
    { name: 'description', weight: 0.1 },
    { name: 'category',    weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
}

export default function HomePage({
  products = [],
  searchQuery, activeCategory, onCategory,
  activeBrand, onBrand, favs, onToggleFav,
  compareList, onAddCompare, inCompare,
}) {
  const fuse = useMemo(() => new Fuse(products, FUSE_OPTS), [products])

  const competitorFuse = useMemo(
    () => new Fuse(competitors, COMPETITOR_FUSE_OPTS),
    []
  )

  const isCompetitor = COMPETITOR_IDS.has(activeBrand)

  const filtered = useMemo(() => {
    if (isCompetitor) {
      const brandProducts = competitors.filter(c => c.brandKey === activeBrand)
      if (!searchQuery?.trim()) return brandProducts
      const fuseInstance = new Fuse(brandProducts, COMPETITOR_FUSE_OPTS)
      return fuseInstance.search(searchQuery).map(r => r.item)
    }

    let list = searchQuery?.trim()
      ? fuse.search(searchQuery).map(r => r.item)
      : products

    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (activeBrand === 'dulux')  list = list.filter(p => p.parentBrand === 'dulux')
    if (activeBrand === 'ppg')    list = list.filter(p => p.parentBrand === 'ppg')

    return list
  }, [fuse, products, searchQuery, activeCategory, activeBrand, isCompetitor])

  const counts = useMemo(() => {
    // Count competitor products per brand for filter chips
    const competitorCounts = {}
    COMPETITOR_BRANDS.forEach(({ id }) => {
      competitorCounts[id] = competitors.filter(c => c.brandKey === id).length
    })

    if (isCompetitor) return competitorCounts

    const base = searchQuery?.trim()
      ? fuse.search(searchQuery).map(r => r.item)
      : products
    const brandFiltered = activeBrand === 'all' ? base
      : base.filter(p => p.parentBrand === activeBrand)
    const c = { all: brandFiltered.length, ...competitorCounts }
    brandFiltered.forEach(p => { c[p.category] = (c[p.category] || 0) + 1 })
    return c
  }, [fuse, products, searchQuery, activeBrand, isCompetitor])

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-4 sm:py-6">
        <div className="mb-6">
          <FilterPills
            activeCategory={activeCategory} onCategory={onCategory}
            activeBrand={activeBrand} onBrand={onBrand}
            counts={counts}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
            {isCompetitor && (
              <span className="ml-1 text-gray-400">
                — competitor reference
              </span>
            )}
          </p>
          {searchQuery && (
            <span className="text-xs text-gray-400">
              Fuzzy search — sorted by relevance
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or clear filters</p>
          </div>
        ) : isCompetitor ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(p => (
              <CompetitorCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favs.includes(p.id)}
                onToggleFav={onToggleFav}
                inCompare={inCompare(p.id)}
                onAddCompare={onAddCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
