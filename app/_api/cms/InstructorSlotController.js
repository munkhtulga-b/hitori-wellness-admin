import fetchData from "../config";

export const getMany = () => {
  return fetchData(`instructorSlots/timeslots`, "GET");
};

export const create = (body) => {
  return fetchData(`instructorSlots`, "POST", body);
};
