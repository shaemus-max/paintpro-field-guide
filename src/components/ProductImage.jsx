import { useState } from 'react'

const CATEGORY_ICONS = {
  interior:   '🏠',
  exterior:   '🏘️',
  primer:     '🪣',
  stain:      '🪵',
  specialty:  '⚙️',
  masonry:    '🧱',
  dryfall:    '💨',
  caulk:      '🔧',
  protective: '🛡️',
}

export default function ProductImage({ product, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)
  const icon = CATEGORY_ICONS[product.category] || '🎨'

  if (product.imageUrl && !imgFailed) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`object-contain ${className}`}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-1">{icon}</div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {product.brand}
        </div>
      </div>
    </div>
  )
}
