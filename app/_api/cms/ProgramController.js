import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`programs${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`programs`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`programs/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData(`programs`, "DELETE", body);
};
