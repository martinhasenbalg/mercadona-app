import ProductPrice from './ProductPrice'
import ProductBadges from './ProductBadges'
import { useFavorites } from '../../context/FavoritesContext'
import { useShoppingList } from '../../context/ShoppingListContext'

export default function ProductCard({ product }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { isInList, addItem, removeItem, updateQuantity, getQuantity } = useShoppingList()

  const fav = isFavorite(product.id)
  const inList = isInList(product.id)
  const qty = getQuantity(product.id)
  const pi = product.price_instructions ?? {}

  const imgSrc = product.thumbnail
    ? `${product.thumbnail}?w=200&auto=format&fit=crop`
    : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col hover:shadow-md transition-shadow relative">
      {/* Favorite button */}
      <button
        onClick={() => fav ? removeFavorite(product.id) : addFavorite(product)}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <svg
          className={`w-4 h-4 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'fill-none text-gray-300 hover:text-red-400'}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="flex justify-center mb-3 h-24">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.display_name}
            className="h-full object-contain"
            loading="lazy"
            width={100}
            height={96}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
        {product.display_name}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{product.packaging}</p>

      <ProductBadges badges={product.badges} price_instructions={pi} />
      <ProductPrice price_instructions={pi} />

      {/* Add to list / quantity */}
      <div className="mt-2">
        {inList ? (
          <div className="flex items-center justify-between border border-mercadona-green rounded-lg overflow-hidden">
            <button
              onClick={() => qty <= 1 ? removeItem(product.id) : updateQuantity(product.id, qty - 1)}
              className="px-3 py-1.5 text-mercadona-green font-bold hover:bg-mercadona-green-light transition-colors"
            >
              {qty <= 1 ? '×' : '−'}
            </button>
            <span className="text-sm font-semibold text-gray-800">{qty}</span>
            <button
              onClick={() => updateQuantity(product.id, qty + 1)}
              className="px-3 py-1.5 text-mercadona-green font-bold hover:bg-mercadona-green-light transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="w-full py-1.5 text-xs font-semibold bg-mercadona-green text-white rounded-lg hover:bg-mercadona-green-dark transition-colors"
          >
            Añadir
          </button>
        )}
      </div>
    </div>
  )
}
