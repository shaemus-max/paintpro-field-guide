/**
 * PaintPro Field Guide — Product Fetcher
 * Attempts to scrape Dulux Canada product pages. Because dulux.ca is
 * JS-rendered, this captures og:image URLs where available and merges
 * them into the split product JSON files.
 *
 * Run: node scripts/fetch-products.js
 */
import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(__dirname, '..', 'src', 'data')

async function tryFetch(url) {
  try {
    const { default: fetch } = await import('node-fetch')
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PaintProBot/1.0)', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(8000),
    })
    return res.ok ? await res.text() : null
  } catch { return null }
}

function extractOgImage(html) {
  const m = html?.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)
  return m?.[1] || ''
}

async function run() {
  console.log('\n🎨  PaintPro — Product Image Fetcher\n')
  const files = ['products-interior.json','products-exterior.json','products-specialty.json','products-ppg.json']
  let updated = 0

  for (const file of files) {
    const p = path.join(DATA, file)
    const products = JSON.parse(fs.readFileSync(p, 'utf8'))
    let changed = false

    for (const product of products) {
      if (product.imageUrl || !product.duluxUrl) continue
      process.stdout.write(`  Fetching ${product.shortName}...`)
      const html = await tryFetch(product.duluxUrl)
      const img  = extractOgImage(html)
      if (img) {
        product.imageUrl = img
        changed = true
        updated++
        console.log(' ✓')
      } else {
        console.log(' (no image found)')
      }
    }

    if (changed) fs.writeFileSync(p, JSON.stringify(products, null, 2))
  }

  console.log(`\n✅  Updated ${updated} image URLs. Start the app: npm run dev\n`)
}

run().catch(e => { console.error(e.message); process.exit(1) })
