import fetchData from "../config";

export default async function reset(body) {
  return fetchData("auth/admin/reset-password", "POST", body);
}
