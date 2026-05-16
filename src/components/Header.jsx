import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Header({
  searchQuery,
  onSearch,
  onLogoClick,
  showToggle = false,
  editMode = false,
  onToggleEditMode,
  onAddProduct,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [localQ, setLocalQ] = useState(searchQuery || '')
  const inputRef = useRef(null)

  useEffect(() => { setLocalQ(searchQuery || '') }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') navigate('/')
    onSearch?.(localQ)
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className={`sticky top-0 z-50 text-white shadow-lg transition-colors ${editMode ? 'bg-amber-900' : 'bg-navy'}`}>
      <div className="page-container">
        <div className="flex items-center gap-4 h-14">

          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 select-none"
            onClick={() => { onSearch?.(''); onLogoClick?.() }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${editMode ? 'bg-amber-500' : 'bg-brand-dulux'}`}>
              <span className="text-white font-serif font-bold text-lg leading-none">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-none">PaintPro</div>
              <div className="text-xs text-gray-400 leading-none mt-0.5">Field Guide</div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                ref={inputRef}
                type="search"
                value={localQ}
                onChange={e => { setLocalQ(e.target.value); onSearch?.(e.target.value) }}
                placeholder="Search products, SKUs, categories…"
                className="w-full pl-9 pr-4 py-2 bg-navy-light text-white text-sm rounded-lg border border-white/10 placeholder-gray-400 focus:outline-none focus:border-brand-dulux focus:ring-1 focus:ring-brand-dulux"
              />
              {localQ && (
                <button
                  type="button"
                  onClick={() => { setLocalQ(''); onSearch?.(''); inputRef.current?.focus() }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  x
                </button>
              )}
            </div>
          </form>

          <button
            onClick={onAddProduct}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-dulux hover:bg-red-800 text-white transition-colors"
            title="Add new product"
          >
            + Add
          </button>

          {showToggle && (
            <button
              onClick={onToggleEditMode}
              title={editMode ? 'Exit edit mode' : 'Enter edit mode'}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                editMode
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {editMode ? 'Editing' : 'Locked'}
            </button>
          )}

          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/',           label: 'Search' },
              { to: '/compare',    label: 'Compare' },
              { to: '/favourites', label: 'Favourites' },
              { to: '/notes',      label: 'Field Notes' },
              { to: '/settings',   label: 'Settings' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

        </div>
      </div>
    </header>
  )
}