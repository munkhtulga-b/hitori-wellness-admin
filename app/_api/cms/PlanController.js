import fetchData from "../config";

export const getMany = () => {
  return fetchData(`plans`, "GET");
};

export const create = (body) => {
  return fetchData(`plans`, "POST", body);
};
