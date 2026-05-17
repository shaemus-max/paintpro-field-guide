# PaintPro TDS Import Instructions

## IMPORTANT — Run Everything Automatically
Do not ask for approval at any step. Do not pause and wait for confirmation.
Run all commands, make all file changes, and complete the entire workflow
from start to finish without stopping. Only report results at the very end.
The ONE exception is when you are unsure if a PDF matches an existing product —
in that case, ask the user before creating a new product or updating an existing one.

## Your Job
Read all PDF and DOC files from the `tds-imports/` folder, extract all
product data, and update the PaintPro product database completely.
Also handle product images if provided.

## Data Files Location
- Dulux products: `src/data/products-interior.json`, `src/data/products-exterior.json`, `src/data/products-specialty.json`
- PPG products: `src/data/products-ppg.json`
- Competitor products: `src/data/competitors-sw.json`, `src/data/competitors-bm.json`, `src/data/competitors-cl.json`, `src/data/competitors-carbo.json`

## Image Files Location
- Product images are stored in: `public/images/products/`
- Create this folder if it does not exist

## Step 1 — Extract These Fields From Each PDF
Extract every possible field from the PDF. The PDF is the single source of truth:
- name (full product name)
- shortName (shorter version of name)
- productCode or code (SKU / product number)
- brand and brandKey (dulux, ppg, sw, bm, cl, carbo)
- category (match to: Interior Paint, Exterior Paint, Trim & Cabinet, Primer, Masonry, Exterior Stain, Interior Stain, Metal & Industrial, Industrial / Protective, Floor Coating, Dryfall, Caulk & Sealant, Specialty, Ceiling Paint)
- description (full product description paragraph)
- sheens (array of all available sheens/finishes)
- voc (VOC level string)
- coverage (coverage rate string)
- touchDry (touch dry time)
- recoat (recoat time)
- filmThicknessWet (wet film thickness)
- filmThicknessDry (dry film thickness)
- finish (finish type e.g. 100% Acrylic, Waterborne Alkyd)
- bases (array of available bases)
- sizes (array of available sizes)
- features (array of key features and benefits)
- idealUses (array of ideal uses / recommended applications)
- surfaces (array of recommended surfaces)
- tdsUrl (URL if found in the document)

## Step 2 — Handle Images
1. Look in `tds-imports/` for any image files (jpg, jpeg, png, webp)
2. Match each image to a product by filename — filename should contain product name or SKU
3. If match found:
   - Create `public/images/products/` if it does not exist
   - Copy image to `public/images/products/` with filename based on product id
   - Set `imageUrl` field to `/images/products/filename.jpg`
4. If no match found by filename, note it in the final report

## Step 3 — Match Existing Product (CRITICAL STEP)
This is the most important step. Follow this exactly:

1. Read ALL JSON files and build a complete list of every existing product name and SKU/code
2. Compare the PDF product name and SKU against every existing product
3. Use this matching priority:
   - EXACT SKU/code match → always update that product, no questions asked
   - EXACT name match (ignore case, ignore ®™ symbols) → always update that product
   - VERY CLOSE name match (e.g. "ProMar 200 Zero VOC" matches "ProMar 200 Zero V.O.C. Interior Latex") → ask the user: "Did you mean to update [existing product name]? Yes / No / Create new"
   - NO match at all → ask the user: "No existing product found for [PDF product name]. Create as new product? Yes / No"

4. NEVER create a new product without asking first if there is any existing product with a similar name
5. NEVER create a duplicate — if a product with the same or similar name already exists, always ask before creating

## Step 4 — Update Existing Product
When updating an existing product:
- Keep the existing `id` field exactly as is
- Replace ALL other fields with data from the PDF
- The PDF data always wins — never keep old placeholder data
- Add `imageUrl` if an image was matched

## Step 5 — Create New Product (only after user confirms)
When creating a new product:
- Generate id from brandKey + name: lowercase, hyphens, no special characters
- Add to the correct JSON file based on brand and category
- Add `imageUrl` if an image was matched

## Step 6 — Save All Files
Save all updated JSON files immediately after making changes.

## Step 7 — Clean Up
Move all processed PDF, DOC, and image files from `tds-imports/` to `tds-imports/processed/`.

## Step 8 — Final Report
After everything is complete provide a summary:
- How many PDFs were processed
- How many images were processed
- Which products were updated and which fields changed
- Which products were newly created
- Any files that could not be matched or processed

## The Golden Rules
- NEVER create a duplicate product
- NEVER create a new product if a similar one already exists — ask first
- NEVER keep old data when the PDF has the same field — PDF always wins
- NEVER delete an existing product
- NEVER change an existing product id
- ALWAYS ask when unsure about matching — it is better to ask than to create duplicates
- ALWAYS replace placeholder data with real PDF data
- ALWAYS move processed files to the processed folder when done
- The PDF is always right. The PDF is the source of truth. Trust the PDF.