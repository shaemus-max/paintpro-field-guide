import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import FilterPills from '../components/FilterPills'
import ProductCard from '../components/ProductCard'
import CompetitorCard from '../components/CompetitorCard'
import BrandBadge from '../components/BrandBadge'
import { competitors, COMPETITOR_BRANDS } from '../data/index'

const COMPETITOR_IDS = new Set(COMPETITOR_BRANDS.map(b => b.id))

const OUR_FUSE_OPTS = {
  keys: [
    { name: 'name',        weight: 0.4 },
    { name: 'shortName',   weight: 0.4 },
    { name: 'productCode', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'category',    weight: 0.1 },
    { name: 'brand',       weight: 0.1 },
    { name: 'features',    weight: 0.05 },
    { name: 'idealUses',   weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
}

const COMP_FUSE_OPTS = {
  keys: [
    { name: 'name',        weight: 0.4 },
    { name: 'brand',       weight: 0.2 },
    { name: 'code',        weight: 0.3 },
    { name: 'category',    weight: 0.1 },
    { name: 'description', weight: 0.1 },
    { name: 'sheens',      weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
}

// Map our category IDs → competitor product category strings
const CAT_ID_TO_COMP_CATS = {
  interior:  ['Interior Paint', 'Trim & Cabinet', 'Kitchen & Bath', 'Ceiling Paint', 'Architectural Interior'],
  exterior:  ['Exterior Paint', 'Architectural Exterior'],
  primer:    ['Primer'],
  stain:     ['Exterior Stain', 'Interior Stain'],
  masonry:   ['Masonry'],
  dryfall:   ['Dryfall'],
  specialty: ['Floor Coating', 'Specialty'],
  protective: [
    'Metal & DTM', 'Industrial', 'Epoxy Coating', 'Zinc Rich Primer',
    'Urethane Topcoat', 'Mastic & Surface Tolerant', 'Acrylic & DTM', 'Specialty Industrial',
  ],
  caulk: [],
}

function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>
  const lower = text.toLowerCase()
  const idx   = lower.indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded-sm not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchResultItem({ product, isCompetitor, query }) {
  const name     = isCompetitor ? product.name : (product.shortName || product.name)
  const code     = isCompetitor ? product.code : product.productCode
  const brandKey = isCompetitor ? product.brandKey : product.brand
  const href     = isCompetitor ? `/competitor/${product.id}` : `/product/${product.id}`

  return (
    <Link
      to={href}
      className="flex flex-col gap-1.5 p-3 rounded-xl border border-gray-100 bg-white
                 hover:border-brand-dulux hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <BrandBadge brand={brandKey} size="sm" />
        {code && <span className="text-xs font-mono text-gray-400">{code}</span>}
        <span className="text-xs text-gray-400 truncate">{product.category}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900 leading-snug">
        <Highlight text={name} query={query} />
      </p>
      {product.description && (
        <p className="text-xs text-gray-500 line-clamp-1">
          <Highlight text={product.description} query={query} />
        </p>
      )}
    </Link>
  )
}

export default function HomePage({
  products = [],
  searchQuery, activeCategory, onCategory,
  activeBrand, onBrand, favs, onToggleFav,
  compareList, onAddCompare, inCompare,
}) {
  const fuse = useMemo(() => new Fuse(products, OUR_FUSE_OPTS), [products])

  const competitorFuse = useMemo(() => new Fuse(competitors, COMP_FUSE_OPTS), [])

  const isSearchMode = (searchQuery?.trim().length ?? 0) >= 2
  const isCompetitor = !isSearchMode && COMPETITOR_IDS.has(activeBrand)

  // ── Unified search across all products ──────────────────────────────────
  const searchResults = useMemo(() => {
    if (!isSearchMode) return { our: [], comp: [] }
    const q = searchQuery.trim()
    return {
      our:  fuse.search(q).map(r => r.item),
      comp: competitorFuse.search(q).map(r => r.item),
    }
  }, [isSearchMode, searchQuery, fuse, competitorFuse])

  // ── Browse-mode filter (category + brand) ────────────────────────────────
  const filtered = useMemo(() => {
    if (isSearchMode) return []

    if (isCompetitor) {
      let list = competitors.filter(c => c.brandKey === activeBrand)
      if (activeCategory !== 'all') {
        const allowed = CAT_ID_TO_COMP_CATS[activeCategory] ?? []
        list = list.filter(p => allowed.includes(p.category))
      }
      if (searchQuery?.trim()) {
        const fi = new Fuse(list, COMP_FUSE_OPTS)
        return fi.search(searchQuery).map(r => r.item)
      }
      return list
    }

    let list = searchQuery?.trim()
      ? fuse.search(searchQuery).map(r => r.item)
      : products

    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (activeBrand === 'dulux')   list = list.filter(p => p.parentBrand === 'dulux')
    if (activeBrand === 'ppg')     list = list.filter(p => p.parentBrand === 'ppg')

    return list
  }, [fuse, products, searchQuery, activeCategory, activeBrand, isCompetitor, isSearchMode])

  // ── Counts for filter pills ──────────────────────────────────────────────
  const counts = useMemo(() => {
    const competitorCounts = {}
    COMPETITOR_BRANDS.forEach(({ id }) => {
      competitorCounts[id] = competitors.filter(c => c.brandKey === id).length
    })

    if (isSearchMode) return competitorCounts

    if (isCompetitor) {
      const brandProds = competitors.filter(c => c.brandKey === activeBrand)
      const c = { all: brandProds.length, ...competitorCounts }
      brandProds.forEach(p => {
        const catId = Object.entries(CAT_ID_TO_COMP_CATS)
          .find(([, cats]) => cats.includes(p.category))?.[0]
        if (catId) c[catId] = (c[catId] || 0) + 1
      })
      return c
    }

    const base = searchQuery?.trim()
      ? fuse.search(searchQuery).map(r => r.item)
      : products
    const brandFiltered = activeBrand === 'all' ? base
      : base.filter(p => p.parentBrand === activeBrand)
    const c = { all: brandFiltered.length, ...competitorCounts }
    brandFiltered.forEach(p => { c[p.category] = (c[p.category] || 0) + 1 })
    return c
  }, [fuse, products, searchQuery, activeBrand, isCompetitor, isSearchMode])

  // ── SEARCH MODE RENDER ───────────────────────────────────────────────────
  if (isSearchMode) {
    const q     = searchQuery.trim()
    const total = searchResults.our.length + searchResults.comp.length

    return (
      <div className="page-enter mb-bottom-nav">
        <div className="page-container py-4 sm:py-6">
          <p className="text-sm text-gray-500 mb-5">
            {total} result{total !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-gray-700">"{q}"</span>
            <span className="ml-2 text-xs text-gray-400">— fuzzy search, sorted by relevance</span>
          </p>

          {/* Your Products */}
          {searchResults.our.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                Your Products
                <span className="text-brand-dulux font-bold">({searchResults.our.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {searchResults.our.map(p => (
                  <SearchResultItem key={p.id} product={p} isCompetitor={false} query={q} />
                ))}
              </div>
            </section>
          )}

          {/* Competitor Products */}
          {searchResults.comp.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                Competitor Products
                <span className="text-navy font-bold">({searchResults.comp.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {searchResults.comp.map(p => (
                  <SearchResultItem key={p.id} product={p} isCompetitor={true} query={q} />
                ))}
              </div>
            </section>
          )}

          {total === 0 && (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-gray-500 font-medium">No products found for "{q}"</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── BROWSE MODE RENDER ───────────────────────────────────────────────────
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
            {isCompetitor && (
              <span className="ml-1 text-gray-400">— competitor reference</span>
            )}
          </p>
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
