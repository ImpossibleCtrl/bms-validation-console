# BMS Validation Dashboard - User Guide

This dashboard allows you to validate data, generate pivot tables, visualize charts, and export corrected datasets.

---

## Getting Started
1. Open the site in your browser (GitHub Pages deployment).
2. On page load, demo data will automatically appear.
   - Rows marked with "DEMO" are fake sample data.
   - Use this to test validation, pivots, and charts immediately.
3. Click **Disable Demo Data** if you want to clear it for the session and upload your own files.

---

## Tabs Overview

### 1. Validation Tab
- **Upload CSV/XLSX** (your dataset).  
- (Optional) Upload reference CSV for Asset Number validation.  
- Click **Run Validation** to check your data.  
- Results will appear in a table with errors and warnings.  
- **Download Failures CSV** to export the list of problems.

### 2. Pivot + Charts Tab
- Build pivot tables with dropdowns:
  - **Row** field (e.g., Site Name, Status).  
  - **Column** field (optional).  
  - **Value** field (e.g., Asset Number, TagID).  
  - **Aggregation** (Count, Sum, Average).  
- Pivot table appears on the **left**.  
- Charts appear on the **right** (Bar, Pie, Line).  
- **Download Pivot Excel** → current pivot only.  
- **Add to Workbook** → queue multiple pivots.  
- **Download All Pivots** → Excel workbook with each pivot on its own sheet.  
- **Download Chart PNG** → saves the current chart as an image.  

#### Saved Pivots
- Save your pivot setups for reuse.  
- Pivots are stored in your browser’s local storage.  
- You can load, delete, and reset to default examples.  

### 3. Corrected Data Tab
- Apply fixes automatically:
  - Fill missing required fields with `MISSING_<field>`.  
  - Normalize Status (Online/Offline).  
  - Ensure TagID or Reason Not Tagged is provided.  
- **Download Corrected Excel** → exports the cleaned dataset.

---

## Demo Data
- Auto-loads when the page opens.  
- Includes both valid and invalid rows to test validation.  
- Highlighted with “DEMO” for clarity.  
- Click **Disable Demo Data** to clear it for the session.  
- Refreshing the page will reload demo data.

---

## Tips
- Always check your validation results before using pivots or corrected data.  
- Use multi-pivot export for reporting: each pivot will become a sheet in the Excel workbook.  
- Save pivots you use often, and reset defaults if needed.  

---

## Exports
- **Failures** → CSV  
- **Pivots** → Excel (single or multiple sheets)  
- **Charts** → PNG  
- **Corrected dataset** → Excel  

