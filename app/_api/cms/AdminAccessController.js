import fetchData from "../config";

export const getMany = () => {
  return fetchData(`adminAccess`, "GET");
};
