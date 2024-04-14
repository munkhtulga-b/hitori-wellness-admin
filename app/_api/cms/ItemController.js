import fetchData from "../config";

export const getMany = () => {
  return fetchData(`items`, "GET");
};

export const create = (body) => {
  return fetchData(`items`, "POST", body);
};
