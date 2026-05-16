# PaintPro TDS Import Instructions

When asked to process TDS files, follow this exact workflow:

## Your Job
Read PDF or DOC files from the `tds-imports/` folder and update the PaintPro product database. Also handle product images if provided.

## Data Files Location
- Dulux products: `src/data/products-interior.json`, `src/data/products-exterior.json`, `src/data/products-specialty.json`
- PPG products: `src/data/products-ppg.json`
- Competitor products: `src/data/competitors-sw.json`, `src/data/competitors-bm.json`, `src/data/competitors-cl.json`, `src/data/competitors-carbo.json`

## Image Files Location
- Product images are stored in: `public/images/products/`
- This folder may need to be created if it does not exist

## Step 1 — Extract These Fields From Each PDF
- name (full product name)
- shortName (shorter version of name)
- productCode or code (SKU)
- brand and brandKey (dulux, ppg, sw, bm, cl, carbo)
- category (match to: Interior Paint, Exterior Paint, Trim & Cabinet, Primer, Masonry, Exterior Stain, Interior Stain, Metal & Industrial, Industrial / Protective, Floor Coating, Dryfall, Caulk & Sealant, Specialty, Ceiling Paint)
- description (product description paragraph)
- sheens (array of available sheens)
- voc (VOC level string)
- coverage (coverage rate string)
- touchDry (touch dry time)
- recoat (recoat time)
- filmThicknessWet (wet film thickness if available)
- filmThicknessDry (dry film thickness if available)
- finish (finish type e.g. 100% Acrylic)
- bases (array of available bases)
- sizes (array of available sizes)
- features (array of key features and benefits)
- idealUses (array of ideal uses)
- surfaces (array of recommended surfaces)
- tdsUrl (URL if found in document)

## Step 2 — Handle Images
1. Look in the `tds-imports/` folder for any image files (jpg, jpeg, png, webp)
2. Try to match each image to a product by filename — the filename should contain the product name or SKU
3. If a match is found:
   - Create the folder `public/images/products/` if it does not exist
   - Copy the image into `public/images/products/` with a clean filename based on the product id (e.g. `dulux-diamond-distinction-interior.jpg`)
   - Set the `imageUrl` field in the product JSON to `/images/products/filename.jpg`
4. If no match can be determined by filename, list the unmatched images in the report and ask which product they belong to

## Step 3 — Match or Create Product
1. Search all JSON files for a product where name or productCode/code matches
2. If MATCH FOUND — update only the fields that have real data from the PDF, do not overwrite fields that have better existing data, add imageUrl if an image was matched
3. If NO MATCH FOUND — create a new product entry with a unique id generated from brandKey + name (lowercase, hyphens, no special chars), add it to the correct JSON file based on brand and category, add imageUrl if an image was matched

## Step 4 — ID Format for New Products
`brandkey-product-name-in-lowercase-with-hyphens`
Example: `dulux-diamond-distinction-interior`

## Step 5 — Save Files
Save the updated JSON files directly. Do not ask for confirmation, just do it.

## Step 6 — Report
After processing all files, tell me:
- How many PDFs were processed
- How many images were processed
- Which products were updated (data and/or image)
- Which products were newly created
- Any images that could not be matched to a product
- Any fields that could not be extracted

## Step 7 — Clean Up
After processing, move all handled files from `tds-imports/` into `tds-imports/processed/` so the folder stays clean for the next batch.

## Important Rules
- Never delete existing products
- Never remove existing data unless the PDF has better data to replace it
- Keep all existing fields that are not in the PDF
- Preserve the existing JSON structure exactly
- If an image already exists for a product, only replace it if a new image was explicitly provided for that product
- Create folders as needed, never fail because a folder does not exist