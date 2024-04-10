/**
 * Check if the value is null or undefined and return a default value if so.
 *
 * @param {any} value - The value to check for null or undefined.
 * @return {any} Either the original value or a default value.
 */
export const nullSafety = (value) => {
  return value === undefined || value === null ? "-" : value;
};

/**
 * Creates a query string from the given query object.
 *
 * @param {Object} queryObject - the object containing key-value pairs for the query parameters
 * @return {string} the query string generated from the query object
 */
export const createQueryString = (queryObject) => {
  if (!queryObject) {
    return "";
  }

  let queryString = "?";
  const keys = Object.keys(queryObject);

  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      queryString += `${key}=${queryObject[key]}`;
    } else {
      queryString += `${key}=${queryObject[key]}&`;
    }
  });

  return queryString;
};

export const exportTableToCSV = (tableId) => {
  const convertToCsv = (tableId) => {
    const table = document.getElementById(tableId);
    if (!table) {
      return;
    }

    const rows = Array.from(table.querySelectorAll("tr"));
    const header =
      Array.from(rows.shift().querySelectorAll("th"))
        .map((cell) => cell.textContent)
        .join(",") + "\n";
    const data = rows
      .map((row) =>
        Array.from(row.querySelectorAll("td"))
          .map((cell) => cell.textContent)
          .join(",")
      )
      .join("\n");

    return header + data;
  };

  const downloadCsv = (csv) => {
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const csv = convertToCsv(tableId);
  if (csv) {
    downloadCsv(csv);
  }

  return null;
};
