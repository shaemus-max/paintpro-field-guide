# PaintPro TDS Import Instructions

## IMPORTANT — Run Everything Automatically
Do not ask for approval at any step. Do not pause and wait for confirmation. 
Run all commands, make all file changes, and complete the entire workflow 
from start to finish without stopping. Only report results at the very end.

## Your Job
Read all PDF and DOC files from the `tds-imports/` folder, extract all 
product data, and update the PaintPro product database completely. 
Also handle product images if provided. Run the entire workflow automatically.

## Data Files Location
- Dulux products: `src/data/products-interior.json`, `src/data/products-exterior.json`, `src/data/products-specialty.json`
- PPG products: `src/data/products-ppg.json`
- Competitor products: `src/data/competitors-sw.json`, `src/data/competitors-bm.json`, `src/data/competitors-cl.json`, `src/data/competitors-carbo.json`
- Custom products: stored in localStorage — cannot be updated via this workflow

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
   - Copy image to `public/images/products/` with filename based on product id (e.g. `sw-promar-200-interior.jpg`)
   - Set `imageUrl` field to `/images/products/filename.jpg`
4. If no match found by filename, note it in the final report

## Step 3 — Match Existing Product or Create New
1. Search ALL JSON files for a product where name OR productCode/code matches the PDF
2. Matching is flexible — ignore case, ignore special characters like ® and ™, partial name matches are acceptable
3. If MATCH FOUND:
   - Replace ALL fields with data from the PDF
   - The PDF data always wins — never keep old data if the PDF has the same field
   - Only keep the existing `id` field unchanged so links do not break
   - Add `imageUrl` if an image was matched
4. If NO MATCH FOUND:
   - Create a brand new product entry
   - Generate id from brandKey + name: lowercase, hyphens, no special characters
   - Add to the correct JSON file based on brand and category
   - Add `imageUrl` if an image was matched

## Step 4 — ID Format for New Products
`brandkey-product-name-in-lowercase-with-hyphens`
Examples:
- `dulux-diamond-distinction-interior`
- `sw-emerald-interior-acrylic-latex`
- `ppg-breakthrough-waterborne-alkyd`

## Step 5 — Save All Files
Save all updated JSON files immediately. Do not ask for confirmation.

## Step 6 — Clean Up
Move all processed PDF, DOC, and image files from `tds-imports/` to `tds-imports/processed/`.
Create the processed folder if it does not exist.

## Step 7 — Final Report Only
Only after everything is complete, provide a summary:
- How many PDFs were processed
- How many images were processed
- Which products were updated and which fields changed
- Which products were newly created
- Any files that could not be matched or processed
- Any fields that could not be extracted from the PDF

## The Golden Rules
- NEVER ask for approval mid-workflow — run everything start to finish automatically
- NEVER keep old data when the PDF has the same field — PDF always wins
- NEVER delete an existing product
- NEVER change an existing product id
- ALWAYS replace placeholder or inaccurate data with real PDF data
- ALWAYS create a new product if no match is found
- ALWAYS move processed files to the processed folder when done
- The PDF is always right. The PDF is the source of truth. Trust the PDF.