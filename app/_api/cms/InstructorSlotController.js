import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`instructorSlots/timeslots${queryString}`, "GET");
};

export const create = (body) => {
  return fetchData(`instructorSlots`, "POST", body);
};

export const update = (id, body) => {
  return fetchData(`instructorSlots/${id}`, "PATCH", body);
};

export const destroy = (id) => {
  return fetchData(`instructorSlots/${id}`, "DELETE");
};
