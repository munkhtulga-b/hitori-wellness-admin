import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`admins${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData("auth/admin/register", "POST", body);
};

export const update = (id, body) => {
  return fetchData(`admins/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData("admins", "DELETE", body);
};
