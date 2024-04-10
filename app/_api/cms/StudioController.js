import fetchData from "../config";

export const getMany = () => {
  return fetchData(`studios`, "GET");
};
