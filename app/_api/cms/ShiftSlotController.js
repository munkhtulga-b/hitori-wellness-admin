import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`shiftSlots${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`shiftSlots`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`shiftSlots/${id}`, "PATCH", body);
};
