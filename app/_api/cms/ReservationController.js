import { createQueryString } from "@/app/_utils/helpers";
import fetchData from "../config";

export const getMany = (queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`reservations${queryString}`, "GET");
};

export const getAllTimeSlots = (studioId, queries) => {
  const queryString = createQueryString(queries);
  return fetchData(`timeslots/${studioId}${queryString}`, "GET");
};
