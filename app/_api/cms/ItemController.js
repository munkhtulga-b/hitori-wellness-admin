import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`items${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`items`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`items/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData(`items`, "DELETE", body);
};
