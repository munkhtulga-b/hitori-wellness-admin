import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`users/plan${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`users/adminCreate`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`users/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData(`users`, "DELETE", body);
};
