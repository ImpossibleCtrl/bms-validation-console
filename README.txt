# BMS Validation Dashboard - User Guide

This dashboard allows you to validate data, generate pivot tables, visualize charts, and export corrected datasets.

---

## Setup
- Place both **index.html** and **demo_data.csv** in the root of your GitHub repo.
- Commit and push changes. Refresh your GitHub Pages site to see the dashboard.

---

## Features
- **Validation Tab**
  - Upload CSV/XLSX (plus optional reference CSV).
  - Run validation: see errors/warnings.
  - Failures exportable as CSV.
- **Pivot + Charts Tab**
  - Configurable pivot builder.
  - Pivot table on left, Chart.js chart (Bar/Pie/Line) on right.
  - Download pivot as Excel.
  - Save/load pivots, reset to defaults.
  - Multi-pivot workbook export.
  - Chart PNG export.
- **Corrected Data Tab**
  - Download corrected Excel with fixes applied.
- **Demo Data**
  - Auto-loads `demo_data.csv` on page open.
  - Rows marked DEMO and highlighted.
  - Includes valid + invalid rows to test validation.
  - Default pivot (Assets by Status) and Bar chart shown immediately.
  - Disable Demo Data button clears demo data for the session.

---

## Exports
- Failures → CSV
- Pivots → Excel (single or workbook)
- Charts → PNG
- Corrected dataset → Excel

