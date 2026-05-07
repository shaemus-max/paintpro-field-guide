import interior  from './products-interior.json'
import exterior  from './products-exterior.json'
import specialty from './products-specialty.json'
import ppg       from './products-ppg.json'

export const allProducts = [...interior, ...exterior, ...specialty, ...ppg]

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
  { id: 'all',    label: 'All Brands' },
  { id: 'dulux',  label: 'Dulux' },
  { id: 'ppg',    label: 'PPG' },
]

export const BRAND_META = {
  dulux:       { label: 'Dulux',       short: 'DLX',   bg: 'bg-brand-dulux',      text: 'text-white' },
  glidden:     { label: 'Glidden',     short: 'GLD',   bg: 'bg-brand-glidden',    text: 'text-white' },
  'perma-crete':{ label: 'Perma-Crete',short: 'PC',    bg: 'bg-brand-perma',      text: 'text-white' },
  'top-gun':   { label: 'Top Gun',     short: 'TG',    bg: 'bg-brand-topgun',     text: 'text-white' },
  'break-through':{ label: 'Break-Through', short: 'BT', bg: 'bg-ppg-blue',       text: 'text-white' },
  sw:          { label: 'Sherwin-Williams', short: 'SW', bg: 'bg-brand-sw',       text: 'text-white' },
  bm:          { label: 'Benjamin Moore',   short: 'BM', bg: 'bg-brand-bm',       text: 'text-white' },
  behr:        { label: 'Behr',         short: 'BEHR',  bg: 'bg-brand-behr',      text: 'text-white' },
  cloverdale:  { label: 'Cloverdale',   short: 'CLO',   bg: 'bg-brand-cloverdale',text: 'text-white' },
  carboline:   { label: 'Carboline',    short: 'CBL',   bg: 'bg-brand-carboline', text: 'text-white' },
}
