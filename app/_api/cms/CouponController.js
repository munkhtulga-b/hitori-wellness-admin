import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`coupons${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`coupons`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`coupons/${id}`, "PATCH", body);
};

export const deleteMany = (body) => {
  return fetchData(`coupons`, "DELETE", body);
};
