import CategoryTree from '../category/CategoryTree'
import Spinner from '../ui/Spinner'

export default function Sidebar({
  categories,
  isLoading,
  selectedSubcategoryId,
  onSelectSubcategory,
  onViewChange,
  activeView,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 z-40 h-full lg:h-auto
          w-64 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-bold text-mercadona-green">Categorías</span>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">×</button>
        </div>

        {/* Nav shortcuts */}
        <div className="flex gap-1 p-2 border-b border-gray-100">
          <NavBtn label="Inicio" icon="🏠" active={activeView === 'browse'} onClick={() => { onViewChange('browse'); onClose() }} />
          <NavBtn label="Favoritos" icon="♥" active={activeView === 'favorites'} onClick={() => { onViewChange('favorites'); onClose() }} />
          <NavBtn label="Lista" icon="🛒" active={activeView === 'shopping'} onClick={() => { onViewChange('shopping'); onClose() }} />
        </div>

        {/* Category tree */}
        <div className="flex-1 overflow-y-auto py-1">
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <CategoryTree
              categories={categories}
              selectedSubcategoryId={selectedSubcategoryId}
              onSelect={(id) => { onSelectSubcategory(id); onClose() }}
            />
          )}
        </div>
      </aside>
    </>
  )
}

function NavBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center py-1.5 text-xs rounded-md transition-colors ${
        active
          ? 'bg-mercadona-green-light text-mercadona-green-dark font-semibold'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
