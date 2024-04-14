import fetchData from "../config";

export const getMany = () => {
  return fetchData(`users`, "GET");
};

export const create = (body) => {
  return fetchData(`users`, "POST", body);
};
