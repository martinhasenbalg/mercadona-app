export default function ProductBadges({ badges = {}, price_instructions = {} }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {price_instructions.is_new && (
        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">Nuevo</span>
      )}
      {price_instructions.price_decreased && (
        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">Precio bajado</span>
      )}
      {badges.requires_age_check && (
        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">+18</span>
      )}
    </div>
  )
}
