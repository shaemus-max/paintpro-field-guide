import interior  from './products-interior.json'
import exterior  from './products-exterior.json'
import specialty from './products-specialty.json'
import ppg       from './products-ppg.json'
import sw        from './competitors-sw.json'
import bm        from './competitors-bm.json'
import cl        from './competitors-cl.json'
import carbo     from './competitors-carbo.json'

// Add parentBrand to Dulux/PPG products for filtering
const duluxProducts = [...interior, ...exterior, ...specialty].map(p => ({ ...p, parentBrand: 'dulux' }))
const ppgProducts   = ppg.map(p => ({ ...p, parentBrand: 'ppg' }))

// Add brandKey to competitor products for filtering
const swProducts    = sw.map(p => ({ ...p, brandKey: p.brandKey || 'sw', parentBrand: 'sw' }))
const bmProducts    = bm.map(p => ({ ...p, brandKey: p.brandKey || 'bm', parentBrand: 'bm' }))
const clProducts    = cl.map(p => ({ ...p, brandKey: p.brandKey || 'cl', parentBrand: 'cl' }))
const carboProducts = carbo.map(p => ({ ...p, brandKey: p.brandKey || 'carbo', parentBrand: 'carbo' }))

// One unified product list — every brand, every product
export const allProducts = [
  ...duluxProducts,
  ...ppgProducts,
  ...swProducts,
  ...bmProducts,
  ...clProducts,
  ...carboProducts,
]

// Keep competitors export for any legacy references
export const competitors = [...swProducts, ...bmProducts, ...clProducts, ...carboProducts]

export { default as crossref } from './crossref.json'

export const CATEGORIES = [
  { id: 'all',        label: 'All Products' },
  { id: 'interior',   label: 'Interior Paint' },
  { id: 'exterior',   label: 'Exterior Paint' },
  { id: 'primer',     label: 'Primer' },
  { id: 'stain',      label: 'Stain' },
  { id: 'specialty',  label: 'Specialty' },
  { id: 'masonry',    label: 'Masonry' },
  { id: 'dryfall',    label: 'Dryfall' },
  { id: 'caulk',      label: 'Caulk / Sealant' },
  { id: 'protective', label: 'Protective' },
]

export const BRANDS = [
  { id: 'all',   label: 'All Brands' },
  { id: 'dulux', label: 'Dulux' },
  { id: 'ppg',   label: 'PPG' },
  { id: 'sw',    label: 'Sherwin-Williams' },
  { id: 'bm',    label: 'Benjamin Moore' },
  { id: 'cl',    label: 'Cloverdale' },
  { id: 'carbo', label: 'Carboline' },
]

export const COMPETITOR_BRANDS = [
  { id: 'sw',    label: 'Sherwin-Williams' },
  { id: 'bm',    label: 'Benjamin Moore' },
  { id: 'cl',    label: 'Cloverdale' },
  { id: 'carbo', label: 'Carboline' },
]

export const BRAND_META = {
  dulux:        { label: 'Dulux',            short: 'DLX',   bg: 'bg-brand-dulux',      text: 'text-white' },
  glidden:      { label: 'Glidden',          short: 'GLD',   bg: 'bg-brand-glidden',    text: 'text-white' },
  'perma-crete':{ label: 'Perma-Crete',      short: 'PC',    bg: 'bg-brand-perma',      text: 'text-white' },
  'top-gun':    { label: 'Top Gun',          short: 'TG',    bg: 'bg-brand-topgun',     text: 'text-white' },
  'break-through':{ label: 'Break-Through',  short: 'BT',    bg: 'bg-ppg-blue',         text: 'text-white' },
  sw:           { label: 'Sherwin-Williams', short: 'SW',    bg: 'bg-brand-sw',         text: 'text-white' },
  bm:           { label: 'Benjamin Moore',   short: 'BM',    bg: 'bg-brand-bm',         text: 'text-white' },
  behr:         { label: 'Behr',             short: 'BEHR',  bg: 'bg-brand-behr',       text: 'text-white' },
  cloverdale:   { label: 'Cloverdale',       short: 'CLO',   bg: 'bg-brand-cloverdale', text: 'text-white' },
  carboline:    { label: 'Carboline',        short: 'CBL',   bg: 'bg-brand-carboline',  text: 'text-white' },
  cl:           { label: 'Cloverdale',       short: 'CL',    bg: 'bg-brand-cloverdale', text: 'text-white' },
  carbo:        { label: 'Carboline',        short: 'CARBO', bg: 'bg-brand-carboline',  text: 'text-white' },
  ppg:          { label: 'PPG',              short: 'PPG',   bg: 'bg-blue-700',         text: 'text-white' },
}