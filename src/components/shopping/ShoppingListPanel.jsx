import { useShoppingList } from '../../context/ShoppingListContext'
import { formatEur } from '../../utils/formatPrice'
import EmptyState from '../ui/EmptyState'
import ExportShareButtons from './ExportShareButtons'

export default function ShoppingListPanel() {
  const { items, removeItem, updateQuantity, clearList } = useShoppingList()

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Lista vacía"
        subtitle="Añade productos desde el catálogo o desde tus favoritos"
      />
    )
  }

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.unit_price || '0')
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lista de compra ({items.length})</h2>
        <button
          onClick={clearList}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Vaciar lista
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {items.map((item) => {
          const imgSrc = item.thumbnail ? `${item.thumbnail}?w=80&auto=format&fit=crop` : null
          const lineTotal = parseFloat(item.unit_price || '0') * item.quantity
          return (
            <div key={item.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
              {/* Image */}
              <div className="w-12 h-12 shrink-0">
                {imgSrc ? (
                  <img src={imgSrc} alt={item.display_name} className="w-full h-full object-contain" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-lg">📦</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.display_name}</p>
                <p className="text-xs text-gray-400">{item.packaging}</p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                  className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm font-bold"
                >
                  {item.quantity <= 1 ? '×' : '−'}
                </button>
                <span className="px-2 text-sm font-semibold min-w-[1.5rem] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <p className="text-sm font-bold text-gray-800 shrink-0 w-16 text-right">
                {formatEur(lineTotal)}
              </p>
            </div>
          )
        })}
      </div>

      {/* Total + Export */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Total estimado</span>
          <span className="text-2xl font-bold text-mercadona-green">{formatEur(total)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">* Los precios pueden variar en tienda</p>
        <ExportShareButtons items={items} />
      </div>
    </div>
  )
}
