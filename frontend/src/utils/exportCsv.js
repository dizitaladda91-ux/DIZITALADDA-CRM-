import toast from "react-hot-toast";

/**
 * Universal Utility to Export Array of Objects to a Downloadable CSV File
 * @param {string} filename - Desired filename without or with .csv
 * @param {Array<{header: string, key: string, formatter?: (val, row) => string}>} columns - List of column definitions
 * @param {Array<Object>} data - Array of row objects to export
 */
export const exportToCsv = (filename = "export.csv", columns = [], data = []) => {
  if (!Array.isArray(data) || data.length === 0) {
    toast.error("No data available to export.");
    return;
  }

  try {
    const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(",");

    const rows = data.map((row) => {
      return columns
        .map((col) => {
          let rawValue = row[col.key];

          if (typeof col.formatter === "function") {
            rawValue = col.formatter(rawValue, row);
          }

          if (rawValue === null || rawValue === undefined) {
            rawValue = "";
          }

          const stringValue = String(rawValue).replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(",");
    });

    const csvContent = "\uFEFF" + [headers, ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const cleanFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    link.setAttribute("download", cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${data.length} records to ${cleanFilename}!`);
  } catch (error) {
    console.error("CSV Export failed:", error);
    toast.error("Failed to generate CSV export file.");
  }
};
