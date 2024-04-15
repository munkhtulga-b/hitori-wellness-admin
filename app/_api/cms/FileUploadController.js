import fetchData from "../config";

export const image = (body) => {
  return fetchData(`upload`, "POST", body);
};
