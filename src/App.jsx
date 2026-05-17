import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header           from './components/Header'
import BottomNav        from './components/BottomNav'
import HomePage         from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import ComparePage      from './pages/ComparePage'
import FavouritesPage   from './pages/FavouritesPage'
import FieldNotesPage   from './pages/FieldNotesPage'
import SettingsPage     from './pages/SettingsPage'
import AddProductModal  from './components/AddProductModal'
import { useFavourites }     from './hooks/useFavourites'
import { useFieldNotes }     from './hooks/useFieldNotes'
import { useCompare }        from './hooks/useCompare'
import { useProductData }    from './hooks/useProductData'
import { useEditMode }       from './hooks/useEditMode'
import { useCustomProducts } from './hooks/useCustomProducts'

export default function App() {
  const [searchQuery,    setSearchQuery]    = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeBrand,    setActiveBrand]    = useState('all')
  const [showAddModal,   setShowAddModal]   = useState(false)

  const { favs, toggle: toggleFav } = useFavourites()
  const { addNote, deleteNote, getNotes, allNotes } = useFieldNotes()
  const { compareList, addToCompare, removeFromCompare, clearCompare, inCompare } = useCompare()

  const {
    products,
    getProduct,
    saveOverride,
    clearFieldOverride,
    isOverridden,
    clearProductOverrides,
    clearAllOverrides,
    exportData,
    importData,
    totalOverrideCount,
  } = useProductData()

  const {
    customProducts,
    hiddenIds,
    addProduct,
    deleteCustomProduct,
    hideBuiltInProduct,
    restoreProduct,
  } = useCustomProducts()

  const { editMode, showToggle, handleLogoClick, toggleEditMode } = useEditMode()

  const handleCompareToggle = (id, add) => {
    if (add) addToCompare(id)
    else removeFromCompare(id)
  }

  const handleDeleteProduct = (product) => {
    if (product.isCustom) deleteCustomProduct(product.id)
    else hideBuiltInProduct(product.id)
  }

  const allVisibleProducts = [
    ...products.filter(p => !hiddenIds.includes(p.id)),
    ...customProducts,
  ]

  const sharedProps = {
    favs,
    onToggleFav: toggleFav,
    compareList,
    onAddCompare: addToCompare,
    inCompare,
    products: allVisibleProducts,
    editMode,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onLogoClick={handleLogoClick}
        showToggle={showToggle}
        editMode={editMode}
        onToggleEditMode={toggleEditMode}
        onAddProduct={() => setShowAddModal(true)}
      />

      {showAddModal && (
        <AddProductModal
          onSave={addProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                {...sharedProps}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                onCategory={setActiveCategory}
                activeBrand={activeBrand}
                onBrand={setActiveBrand}
                onAddProduct={() => setShowAddModal(true)}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                {...sharedProps}
                getProduct={id =>
                  allVisibleProducts.find(p => p.id === id) || null
                }
                saveOverride={saveOverride}
                clearFieldOverride={clearFieldOverride}
                isOverridden={isOverridden}
                addNote={addNote}
                getNotes={getNotes}
                deleteNote={deleteNote}
                onDeleteProduct={handleDeleteProduct}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <ComparePage
                products={allVisibleProducts}
                compareList={compareList}
                onRemove={handleCompareToggle}
                onClear={clearCompare}
              />
            }
          />
          <Route
            path="/favourites"
            element={<FavouritesPage {...sharedProps} />}
          />
          <Route
            path="/notes"
            element={
              <FieldNotesPage allNotes={allNotes} deleteNote={deleteNote} />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                editMode={editMode}
                totalOverrideCount={totalOverrideCount}
                exportData={exportData}
                importData={importData}
                clearAllOverrides={clearAllOverrides}
              />
            }
          />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}