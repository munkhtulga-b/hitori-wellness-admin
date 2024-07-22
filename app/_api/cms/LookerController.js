import fetchData from "../config";

export const check = () => {
  return fetchData(`looker`, "GET");
};
