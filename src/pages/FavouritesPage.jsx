import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function FavouritesPage({ products = [], favs, onToggleFav, compareList, onAddCompare, inCompare }) {
  const savedProducts = favs.map(id => products.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="page-enter mb-bottom-nav">
      <div className="page-container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-gray-900">Favourites</h1>
          <span className="text-sm text-gray-400">{savedProducts.length} saved</span>
        </div>

        {savedProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-3xl mb-3">🤍</p>
            <p className="text-gray-500 font-medium">No favourites yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              Tap the heart icon on any product to save it here
            </p>
            <Link to="/" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {savedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isFav
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
