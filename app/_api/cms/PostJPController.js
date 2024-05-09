import fetchData from "../config";

export const getOne = (postCode) => {
  return fetchData(`postcode/${postCode}`, "GET");
};
