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
