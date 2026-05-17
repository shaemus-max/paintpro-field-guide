import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import FilterPills from '../components/FilterPills'
import ProductCard from '../components/ProductCard'
import BrandBadge from '../components/BrandBadge'

const FUSE_OPTS = {
  keys: [
    { name: 'name',        weight: 0.4 },
    { name: 'shortName',   weight: 0.3 },
    { name: 'productCode', weight: 0.2 },
    { name: 'code',        weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'category',    weight: 0.1 },
    { name: 'brand',       weight: 0.1 },
    { name: 'features',    weight: 0.05 },
    { name: 'idealUses',   weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
}

const CAT_MAP = {
  interior:   ['Interior Paint', 'Trim & Cabinet', 'Kitchen & Bath', 'Ceiling Paint', 'Architectural Interior'],
  exterior:   ['Exterior Paint', 'Architectural Exterior'],
  primer:     ['Primer'],
  stain:      ['Exterior Stain', 'Interior Stain'],
  masonry:    ['Masonry'],
  dryfall:    ['Dryfall'],
  specialty:  ['Floor Coating', 'Specialty'],
  protective: ['Metal & Industrial', 'Industrial / Protective', 'Metal & DTM', 'Epoxy Coating', 'Zinc Rich Primer', 'Urethane Topcoat', 'Mastic & Surface Tolerant', 'Acrylic & DTM', 'Specialty Industrial'],
  caulk:      ['Caulk & Sealant'],
}

function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-gray-900 rounded-sm not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function SearchResultItem({ product, query }) {
  const name = product.shortName || product.name
  const code = product.productCode || product.code

  return (
    <Link
      to={`/product/${product.id}`}
      className="flex flex-col gap-1.5 p-3 rounded-xl border border-gray-100 bg-white hover:border-brand-dulux hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <BrandBadge brand={product.brandKey || product.brand} size="sm" />
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
  onAddProduct,
}) {
  const fuse = useMemo(() => new Fuse(products, FUSE_OPTS), [products])

  const isSearchMode = (searchQuery?.trim().length ?? 0) >= 2

  const searchResults = useMemo(() => {
    if (!isSearchMode) return []
    return fuse.search(searchQuery.trim()).map(r => r.item)
  }, [isSearchMode, searchQuery, fuse])

  const filtered = useMemo(() => {
    if (isSearchMode) return []

    let list = [...products]

    if (activeBrand !== 'all') {
      list = list.filter(p =>
        p.parentBrand === activeBrand ||
        p.brandKey === activeBrand ||
        p.brand?.toLowerCase().includes(activeBrand)
      )
    }

    if (activeCategory !== 'all') {
      const allowed = CAT_MAP[activeCategory]
      if (allowed) list = list.filter(p => allowed.includes(p.category))
      else list = list.filter(p => p.category === activeCategory)
    }

    return list
  }, [products, searchQuery, activeCategory, activeBrand, isSearchMode])

  const counts = useMemo(() => {
    const base = activeBrand === 'all' ? products : products.filter(p =>
      p.parentBrand === activeBrand || p.brandKey === activeBrand
    )
    const c = { all: base.length }
    base.forEach(p => {
      c[p.category] = (c[p.category] || 0) + 1
      const catId = Object.entries(CAT_MAP).find(([, cats]) => cats.includes(p.category))?.[0]
      if (catId) c[catId] = (c[catId] || 0) + 1
    })
    return c
  }, [products, activeBrand])

  // ── SEARCH MODE ──────────────────────────────────────────────────────────
  if (isSearchMode) {
    const q = searchQuery.trim()
    return (
      <div className="page-enter mb-bottom-nav">
        <div className="page-container py-4 sm:py-6">
          <p className="text-sm text-gray-500 mb-5">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-gray-700">"{q}"</span>
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.map(p => (
                <SearchResultItem key={p.id} product={p} query={q} />
              ))}
            </div>
          ) : (
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

  // ── BROWSE MODE ──────────────────────────────────────────────────────────
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
          </p>
          <button
            onClick={onAddProduct}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dulux text-white rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different filter or clear filters</p>
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