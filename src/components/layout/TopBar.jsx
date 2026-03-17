import { useFavorites } from '../../context/FavoritesContext'
import { useShoppingList } from '../../context/ShoppingListContext'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ searchQuery, onSearchChange, onViewChange, onMenuToggle, onLoginClick }) {
  const { favorites } = useFavorites()
  const { items } = useShoppingList()
  const { user, signOut, hasSupabase } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={onMenuToggle}
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <button
          className="flex items-center gap-2 shrink-0"
          onClick={() => onViewChange('browse')}
        >
          <span className="text-mercadona-green font-bold text-lg leading-none">Mercadona</span>
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full border border-transparent focus:border-mercadona-green focus:bg-white focus:outline-none transition"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Favorites */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={() => onViewChange('favorites')}
          aria-label="Favoritos"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-mercadona-orange text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {favorites.length > 99 ? '99+' : favorites.length}
            </span>
          )}
        </button>

        {/* Shopping list */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          onClick={() => onViewChange('shopping')}
          aria-label="Lista de compra"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-mercadona-green text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {items.length > 99 ? '99+' : items.length}
            </span>
          )}
        </button>

        {/* User / Auth */}
        {hasSupabase && (
          user ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:block text-xs text-gray-500 max-w-[120px] truncate">{user.email}</span>
              <button
                onClick={signOut}
                title="Cerrar sesión"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="shrink-0 px-3 py-1.5 text-sm font-medium text-mercadona-green border border-mercadona-green rounded-lg hover:bg-green-50 transition"
            >
              Entrar
            </button>
          )
        )}
      </div>
    </header>
  )
}
