import fetchData from "../config";

export const getMany = () => {
  return fetchData(`studios`, "GET");
};

export const create = (body) => {
  return fetchData(`studios`, "POST", body);
};
