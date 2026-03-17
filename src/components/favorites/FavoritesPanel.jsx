import { useFavorites } from '../../context/FavoritesContext'
import { useShoppingList } from '../../context/ShoppingListContext'
import { formatEur } from '../../utils/formatPrice'
import EmptyState from '../ui/EmptyState'

export default function FavoritesPanel() {
  const { favorites, removeFavorite } = useFavorites()
  const { isInList, addItem, removeItem } = useShoppingList()

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="♥"
        title="Sin favoritos"
        subtitle="Pulsa el corazón en cualquier producto para guardarlo aquí"
      />
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Favoritos ({favorites.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {favorites.map((item) => {
          const inList = isInList(item.id)
          const imgSrc = item.thumbnail ? `${item.thumbnail}?w=200&auto=format&fit=crop` : null
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:shadow-md transition-shadow relative">
              {/* Remove favorite */}
              <button
                onClick={() => removeFavorite(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
                aria-label="Quitar de favoritos"
              >
                <svg className="w-4 h-4 fill-red-500 text-red-500" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <div className="flex justify-center mb-3 h-24">
                {imgSrc ? (
                  <img src={imgSrc} alt={item.display_name} className="h-full object-contain" loading="lazy" width={100} height={96} />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">{item.display_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.packaging}</p>
              <p className="font-bold text-gray-900 mt-auto pt-2">{formatEur(item.unit_price)}</p>

              <button
                onClick={() => inList ? removeItem(item.id) : addItem(item)}
                className={`mt-2 w-full py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  inList
                    ? 'border border-mercadona-green text-mercadona-green hover:bg-mercadona-green-light'
                    : 'bg-mercadona-green text-white hover:bg-mercadona-green-dark'
                }`}
              >
                {inList ? 'En la lista ✓' : 'Añadir a lista'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
