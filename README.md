
# BMS Validation Console

## Overview
The **BMS Validation Console** is a browser-based tool for validating and correcting asset collection spreadsheets.  
It applies a set of 26 hardcoded validation rules to enforce data integrity, rebuilds fields when possible, and produces two outputs:
- **Corrected.xlsx** → Auto-fixes applied (casing, CA-Age population, Asset Name rebuild, etc.).
- **Validation_Report.xlsx** → Original dataset plus `Row #` and `Validation Errors` column.

## Features
- **Dual Outputs**
  - Corrected file with automated fixes.
  - Validation Report with untouched data + errors column.
- **Row-Grouped Results**
  - Errors displayed by row in the browser.
- **Summary Dashboard**
  - Interactive Chart.js bar chart shows issue counts by field.
- **26 Validation Rules**
  - Covers Site, Workzone, Building, Floor, Room, Asset #, Status, CA fields, Images, Manufacturer, Model, Serial, JACS, ID, and more.

## Usage
1. Open `index.html` in any modern browser.
2. Upload your dataset (CSV or XLSX).
3. Click **Run Validation**.
4. Review errors grouped by row in the results panel.
5. Review summary chart for issue counts by field.
6. Download the outputs:
   - 🔵 **Corrected.xlsx** — includes auto-fixes where possible.
   - 🟢 **Validation_Report.xlsx** — original data + `Row #` and `Validation Errors`.

## Deployment (GitHub Pages)
1. Unzip the package.
2. Add files (`index.html`, `style.css`, `rules.js`) to your GitHub Pages repository.
3. Commit and push.
4. Access the live console via your GitHub Pages site URL.

## Validation Rules (Summary)
1. Site Name — cannot be blank.  
2. Workzone — must match Asset Name segment.  
3. Building — must match Asset Name segment.  
4. Floor/Room — must match Asset Name segment.  
5. Asset # prefix — must appear in Asset Name.  
6. Asset # full string — must appear in Asset Name.  
7. Status — must be Online/Offline.  
8. Reason Not Tagged — required if TagID blank.  
9. Asset Status — must match allowed list.  
10. Asset Record Status — must be Active/In-Active.  
11. In-Service Date — must be valid format.  
12. CA-Age — must match In-Service Date logic.  
13. CA-Condition — required, valid range.  
14. Asset Condition — required, aligns with CA-Condition.  
15. CA-Environment — must match allowed list.  
16. Capacity Qty — valid only if Unit present.  
17. Capacity Unit — must match allowed list.  
18. Images — at least 3 required.  
19. Manufacturer — required, proper casing.  
20. Model — required, uppercase.  
21. Serial # — required, uppercase.  
22. JACS Code — required, uppercase.  
23. ID — required, uppercase.  
24. Asset Status (simple) — must be valid.  
25. Asset Record Status (simple) — must be valid.  
26. Photos — at least 3 (5 for panelboards/switchgear/switchboards).  

## Requirements
- Works offline in any modern browser.
- No server-side dependencies.

## Notes
- Validation rules are **hardcoded** based on the provided specification.
- Corrected.xlsx includes only auto-fixes; human-entered fields remain flagged if invalid/missing.
