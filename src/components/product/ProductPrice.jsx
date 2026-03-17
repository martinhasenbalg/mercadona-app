import { formatEur, formatRefPrice } from '../../utils/formatPrice'

export default function ProductPrice({ price_instructions = {} }) {
  const {
    unit_price,
    previous_unit_price,
    price_decreased,
    approx_size,
    selling_method,
  } = price_instructions

  const refPriceStr = formatRefPrice(price_instructions)
  const prefix = approx_size || selling_method === 1 ? '~' : ''

  return (
    <div className="mt-auto pt-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-bold text-gray-900">
          {prefix}{formatEur(unit_price)}
        </span>
        {price_decreased && previous_unit_price && (
          <span className="text-xs text-gray-400 line-through">
            {formatEur(previous_unit_price)}
          </span>
        )}
      </div>
      {refPriceStr && (
        <p className="text-xs text-gray-500 mt-0.5">{refPriceStr}</p>
      )}
    </div>
  )
}
