import { BRAND_META } from '../data/index'

const COLOURS = {
  dulux:         'bg-brand-dulux text-white',
  glidden:       'bg-brand-glidden text-white',
  'perma-crete': 'bg-brand-perma text-white',
  'top-gun':     'bg-brand-topgun text-white',
  'break-through':'bg-[#0066B3] text-white',
  sw:            'bg-brand-sw text-white',
  bm:            'bg-brand-bm text-white',
  behr:          'bg-brand-behr text-white',
  cloverdale:    'bg-brand-cloverdale text-white',
  carboline:     'bg-brand-carboline text-white',
}

export default function BrandBadge({ brand, size = 'sm', className = '' }) {
  const meta = BRAND_META[brand]
  if (!meta) return null
  const colour = COLOURS[brand] || 'bg-gray-500 text-white'
  const sizeClass = size === 'lg'
    ? 'px-3 py-1 text-sm font-bold'
    : 'px-2 py-0.5 text-xs font-bold'

  return (
    <span className={`inline-flex items-center rounded-full ${colour} ${sizeClass} ${className}`}>
      {size === 'lg' ? meta.label : meta.short}
    </span>
  )
}
