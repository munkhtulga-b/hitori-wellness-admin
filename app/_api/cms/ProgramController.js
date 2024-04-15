import fetchData from "../config";

export const getMany = () => {
  return fetchData(`programs`, "GET");
};

export const create = (body) => {
  return fetchData(`programs`, "POST", body);
};
