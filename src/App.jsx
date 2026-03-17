import { useState, useRef } from 'react'
import { useCategories } from './hooks/useCategories'
import { useCategoryProducts } from './hooks/useCategoryProducts'
import { useSearch } from './hooks/useSearch'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import ProductGrid from './components/product/ProductGrid'
import SearchResults from './components/search/SearchResults'
import FavoritesPanel from './components/favorites/FavoritesPanel'
import ShoppingListPanel from './components/shopping/ShoppingListPanel'
import AuthModal from './components/auth/AuthModal'

export default function App() {
  const [activeView, setActiveView] = useState('browse')
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { categories, isLoading: catsLoading } = useCategories()

  const sharedCache = useRef(new Map())
  const { data, isLoading: productsLoading, error } = useCategoryProducts(selectedSubcategoryId)

  if (data && selectedSubcategoryId) {
    sharedCache.current.set(selectedSubcategoryId, { data, fetchedAt: Date.now() })
  }

  const { query, setQuery, results } = useSearch(sharedCache)

  const handleViewChange = (view) => {
    setActiveView(view)
    if (view !== 'browse') setQuery('')
  }

  const handleSearch = (q) => {
    setQuery(q)
    if (q.trim()) setActiveView('browse')
  }

  const handleSelectSubcategory = (id) => {
    setSelectedSubcategoryId(id)
    setActiveView('browse')
    setQuery('')
  }

  const showSearch = activeView === 'browse' && query.trim().length > 0

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopBar
        searchQuery={query}
        onSearchChange={handleSearch}
        onViewChange={handleViewChange}
        onMenuToggle={() => setSidebarOpen(true)}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          isLoading={catsLoading}
          selectedSubcategoryId={selectedSubcategoryId}
          onSelectSubcategory={handleSelectSubcategory}
          onViewChange={handleViewChange}
          activeView={activeView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'favorites' && <FavoritesPanel />}
          {activeView === 'shopping' && <ShoppingListPanel />}
          {activeView === 'browse' && (
            showSearch
              ? <SearchResults query={query} results={results} />
              : <ProductGrid data={data} isLoading={productsLoading} error={error} />
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
