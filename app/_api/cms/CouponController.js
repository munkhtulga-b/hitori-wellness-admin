import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`coupons${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`coupons`, "POST", body);
};
