import { useState } from 'react'

const BRANDS = [
  { label: 'Dulux',            brandKey: 'dulux',   brand: 'Dulux Canada' },
  { label: 'PPG',              brandKey: 'ppg',     brand: 'PPG Paints' },
  { label: 'PPG Protective',   brandKey: 'ppg-pmc', brand: 'PPG Protective' },
  { label: 'Sherwin-Williams', brandKey: 'sw',      brand: 'Sherwin-Williams' },
  { label: 'Benjamin Moore',   brandKey: 'bm',      brand: 'Benjamin Moore' },
  { label: 'Cloverdale',       brandKey: 'cl',      brand: 'Cloverdale Paint' },
  { label: 'Carboline',        brandKey: 'carbo',   brand: 'Carboline' },
]

const CATEGORIES = [
  'Interior Paint', 'Exterior Paint', 'Trim & Cabinet', 'Kitchen & Bath',
  'Ceiling Paint', 'Primer', 'Masonry', 'Exterior Stain', 'Interior Stain',
  'Metal & Industrial', 'Industrial / Protective', 'Floor Coating',
  'Dryfall', 'Caulk & Sealant', 'Specialty',
]

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dulux bg-white"

export default function AddProductModal({ onSave, onClose }) {
  const [fields, setFields] = useState({
    brandKey:        'dulux',
    brand:           'Dulux Canada',
    name:            '',
    productCode:     '',
    category:        'Interior Paint',
    description:     '',
    sheens:          '',
    voc:             '',
    coverage:        '',
    touchDry:        '',
    recoat:          '',
    filmThicknessWet:'',
    filmThicknessDry:'',
    finish:          '',
    bases:           '',
    sizes:           '',
    tdsUrl:          '',
    sdsUrl:          '',
    features:        '',
    idealUses:       '',
    surfaces:        '',
    priceGallon:     '75.00',
    price5Gallon:    '320.00',
    priceQuart:      '',
  })

  const set = (key, value) => setFields(prev => ({ ...prev, [key]: value }))

  const handleBrandChange = (brandKey) => {
    const found = BRANDS.find(b => b.brandKey === brandKey)
    if (found) {
      set('brandKey', found.brandKey)
      set('brand', found.brand)
    }
  }

  const handleSubmit = () => {
    if (!fields.name.trim()) {
      alert('Product name is required.')
      return
    }
    onSave(fields)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-serif text-xl text-gray-900">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">x</button>
        </div>

        <div className="px-6 py-5 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand">
              <select value={fields.brandKey} onChange={e => handleBrandChange(e.target.value)} className={inputCls}>
                {BRANDS.map(b => <option key={b.brandKey} value={b.brandKey}>{b.label}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={fields.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Product Name" hint="required">
            <input type="text" value={fields.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Diamond Distinction Interior" className={inputCls} />
          </Field>

          <Field label="SKU / Product Code">
            <input type="text" value={fields.productCode} onChange={e => set('productCode', e.target.value)} placeholder="e.g. 0610" className={inputCls} />
          </Field>

          <Field label="Description">
            <textarea value={fields.description} onChange={e => set('description', e.target.value)} placeholder="Brief product description..." rows={3} className={inputCls + ' resize-none'} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Sheens" hint="comma separated">
              <input type="text" value={fields.sheens} onChange={e => set('sheens', e.target.value)} placeholder="Flat, Eggshell, Satin" className={inputCls} />
            </Field>
            <Field label="VOC">
              <input type="text" value={fields.voc} onChange={e => set('voc', e.target.value)} placeholder="Low VOC" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Coverage">
              <input type="text" value={fields.coverage} onChange={e => set('coverage', e.target.value)} placeholder="400 sq ft/gal" className={inputCls} />
            </Field>
            <Field label="Touch Dry">
              <input type="text" value={fields.touchDry} onChange={e => set('touchDry', e.target.value)} placeholder="1 hour" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Recoat">
              <input type="text" value={fields.recoat} onChange={e => set('recoat', e.target.value)} placeholder="4 hours" className={inputCls} />
            </Field>
            <Field label="Finish Type">
              <input type="text" value={fields.finish} onChange={e => set('finish', e.target.value)} placeholder="100% Acrylic" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Film Thickness (Wet)">
              <input type="text" value={fields.filmThicknessWet} onChange={e => set('filmThicknessWet', e.target.value)} placeholder="4-5 mils" className={inputCls} />
            </Field>
            <Field label="Film Thickness (Dry)">
              <input type="text" value={fields.filmThicknessDry} onChange={e => set('filmThicknessDry', e.target.value)} placeholder="1.5-2 mils" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Bases" hint="comma separated">
              <input type="text" value={fields.bases} onChange={e => set('bases', e.target.value)} placeholder="White/Pastel, Midtone, Deep" className={inputCls} />
            </Field>
            <Field label="Sizes" hint="comma separated">
              <input type="text" value={fields.sizes} onChange={e => set('sizes', e.target.value)} placeholder="946 mL, 3.78 L, 18.93 L" className={inputCls} />
            </Field>
          </div>

          <Field label="Features & Benefits" hint="comma separated">
            <input type="text" value={fields.features} onChange={e => set('features', e.target.value)} placeholder="Excellent hide, Washable, Low odour" className={inputCls} />
          </Field>

          <Field label="Ideal Uses" hint="comma separated">
            <input type="text" value={fields.idealUses} onChange={e => set('idealUses', e.target.value)} placeholder="Living rooms, Bedrooms, Hallways" className={inputCls} />
          </Field>

          <Field label="Surfaces" hint="comma separated">
            <input type="text" value={fields.surfaces} onChange={e => set('surfaces', e.target.value)} placeholder="Drywall, Plaster, Previously painted" className={inputCls} />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Price - Quart (CAD)">
              <input type="number" step="0.01" min="0" value={fields.priceQuart} onChange={e => set('priceQuart', e.target.value)} placeholder="0.00" className={inputCls} />
            </Field>
            <Field label="Price - Gallon (CAD)">
              <input type="number" step="0.01" min="0" value={fields.priceGallon} onChange={e => set('priceGallon', e.target.value)} placeholder="75.00" className={inputCls} />
            </Field>
            <Field label="Price - 5 Gallon (CAD)">
              <input type="number" step="0.01" min="0" value={fields.price5Gallon} onChange={e => set('price5Gallon', e.target.value)} placeholder="320.00" className={inputCls} />
            </Field>
          </div>

          <Field label="TDS URL">
            <input type="url" value={fields.tdsUrl} onChange={e => set('tdsUrl', e.target.value)} placeholder="https://..." className={inputCls} />
          </Field>

          <Field label="SDS URL">
            <input type="url" value={fields.sdsUrl} onChange={e => set('sdsUrl', e.target.value)} placeholder="https://..." className={inputCls} />
          </Field>

        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={handleSubmit} className="flex-1 py-2.5 bg-brand-dulux text-white rounded-xl text-sm font-semibold hover:bg-red-800 transition-colors">
            Add Product
          </button>
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}