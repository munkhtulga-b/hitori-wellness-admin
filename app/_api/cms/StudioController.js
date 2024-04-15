import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`studios${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`studios`, "POST", body);
};

export const deleteMany = (body) => {
  return fetchData(`studios`, "DELETE", body);
};
