// This is a utility service for handling Excel downloads
// You can place this in a services or utils folder

import * as XLSX from "xlsx"

/**
 * Converts data to an Excel file and triggers download
 * @param {Array} data - The data to export
 * @param {Object} options - Configuration options
 * @param {string} options.filename - The name of the file to download
 * @param {string} options.sheetName - The name of the worksheet
 * @param {Function} options.formatter - Optional function to format data before export
 */
export const exportToExcel = (data, options = {}) => {
  const { filename = "export.xlsx", sheetName = "Sheet1", formatter = (data) => data } = options

  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Format the data if needed
  const formattedData = formatter(data)

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generate the Excel file and trigger download
  XLSX.writeFile(workbook, filename)
}

/**
 * Creates column headers with specific widths
 * @param {Object} worksheet - The worksheet to modify
 * @param {Array} columns - Array of column definitions with header and width
 */
export const setColumnWidths = (worksheet, columns) => {
  // Set column widths
  worksheet["!cols"] = columns.map((col) => ({ wch: col.width }))

  // Return the modified worksheet
  return worksheet
}

/**
 * Adds styling to specific cells
 * @param {Object} worksheet - The worksheet to modify
 * @param {Array} styles - Array of style definitions with cell and style properties
 */
export const applyCellStyles = (worksheet, styles) => {
  styles.forEach((style) => {
    const cell = worksheet[style.cell]
    if (cell) {
      cell.s = style.style
    }
  })

  return worksheet
}

