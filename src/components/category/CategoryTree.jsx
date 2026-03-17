import { useState, useEffect } from 'react'
import CategoryGroup from './CategoryGroup'

export default function CategoryTree({ categories, selectedSubcategoryId, onSelect }) {
  const [openIds, setOpenIds] = useState(new Set())

  // Open the group that contains the selected subcategory
  useEffect(() => {
    if (!selectedSubcategoryId) return
    for (const cat of categories) {
      if (cat.categories?.some((sub) => sub.id === selectedSubcategoryId)) {
        setOpenIds((prev) => new Set([...prev, cat.id]))
        break
      }
    }
  }, [selectedSubcategoryId, categories])

  // Open first group by default
  useEffect(() => {
    if (categories.length > 0 && openIds.size === 0) {
      setOpenIds(new Set([categories[0].id]))
    }
  }, [categories])

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <nav className="text-sm">
      {categories.map((cat) => (
        <CategoryGroup
          key={cat.id}
          category={cat}
          isOpen={openIds.has(cat.id)}
          onToggle={() => toggle(cat.id)}
          selectedSubcategoryId={selectedSubcategoryId}
          onSelectSubcategory={onSelect}
        />
      ))}
    </nav>
  )
}
