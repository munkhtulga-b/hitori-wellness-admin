/* eslint-disable no-useless-escape */
import dayjs from "dayjs";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const resp = await fetch(
    `${
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_DEV_BASE_URL
        : process.env.NEXT_PUBLIC_PROD_BASE_URL
    }/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await resp.json();
  return { isOk: resp.ok, data };
};

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
 * Validate if the input value is a valid password.
 *
 * @param {string} value - The value to be validated
 * @return {boolean} Whether the value is a valid password or not
 */
export const isValidPassword = (value) => {
  // Regular expressions to check for symbol, uppercase character, and number
  const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const uppercaseRegex = /[A-Z]/;
  const lowecaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;

  // Check if the string meets the length requirement
  const isLongEnough = value?.length >= 8;

  let cretariasMet = 0;

  if (symbolRegex.test(value)) cretariasMet++;
  if (lowecaseRegex.test(value)) cretariasMet++;
  if (uppercaseRegex.test(value)) cretariasMet++;
  if (numberRegex.test(value)) cretariasMet++;

  // Check if the password meets the criteria
  return {
    isLongEnough,
    isContainingSymbol: symbolRegex.test(value),
    isContainingLowercase: value ? lowecaseRegex.test(value) : false,
    isContainingUppercase: uppercaseRegex.test(value),
    isContainingNumber: numberRegex.test(value),
    cretariasMet,
  };
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

/**
 * Formats a number by adding thousand separators.
 *
 * @param {number|string|null|undefined} value - The value to be formatted.
 * @return {string} The formatted value with thousand separators.
 */
export const thousandSeparator = (value) => {
  let result = "0";
  if (value !== null && value !== undefined) {
    result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result;
};

/**
 * Parses a string representation of a number and returns the corresponding number value.
 *
 * @param {string} value - The string representation of the number to be parsed.
 * @return {number} The parsed number value.
 */
export const parseNumberString = (value) => {
  const noCommaValue = value.toString().replace(/,/g, "");
  return Number(noCommaValue);
};

/**
 * Generates an array of objects representing years.
 *
 * @return {Array} An array of objects containing the value and label of each year.
 */
export const getYears = () => {
  const years = [];
  for (let i = 0; i < 100; i++) {
    years.push({
      value: dayjs().year() - i,
      label: dayjs().year() - i,
    });
  }
  return years;
};

/**
 * Generates an array of objects representing months with formatted values and labels.
 *
 * @return {Array} An array of objects containing month values and labels
 */
export const getMonths = () => {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push({
      value: dayjs()
        .month(month - 1)
        .format("MM"),
      label: dayjs()
        .month(month - 1)
        .format("MM"),
    });
  }
  return months;
};

/**
 * Generates an array of days with padded values from 01 to 31.
 *
 * @return {Array} An array of objects containing 'value' and 'label' properties.
 */
export const getDays = () => {
  const days = [];
  for (let day = 1; day <= 31; day++) {
    days.push({
      value: day.toString().padStart(2, "0"),
      label: day.toString().padStart(2, "0"),
    });
  }
  return days;
};

/**
 * Removes HTML tags from a given string.
 *
 * @param {string} htmlString - The string containing HTML tags.
 * @return {string} The string with HTML tags removed.
 */
export const stripHTMLstring = (htmlString) => {
  if (htmlString) {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
  }
};
