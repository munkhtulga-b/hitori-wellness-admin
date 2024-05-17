import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`plans${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`plans`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`plans/${id}`, "PATCH", body);
};

export const cancel = (id) => {
  return fetchData(`memberplans/cancel/${id}`, "DELETE");
};
