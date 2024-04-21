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
 * Gets the address from the postal code using the Postcode-JP API.
 *
 * @param {string} postCode - The postal code to look up.
 * @return {Promise} A Promise that resolves to the JSON response from the API.
 */
export const getAddressFromPostalCode = async (postCode) => {
  const resp = await fetch(
    `https://apis.postcode-jp.com/api/v5/postcodes/${postCode}`,
    {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_POST_JP_API_KEY,
      },
    }
  );

  return resp.json();
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

export const thousandSeparator = (value) => {
  let result = "0";
  if (value !== null && value !== undefined) {
    result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result;
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
