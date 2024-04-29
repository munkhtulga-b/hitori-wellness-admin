import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`instructors${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`instructors`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`instructors/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData(`instructors`, "DELETE", body);
};
