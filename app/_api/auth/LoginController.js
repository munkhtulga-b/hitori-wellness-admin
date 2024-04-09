import fetchData from "../config";

export default async function login(body) {
  return fetchData("auth/admin/login", "POST", body);
}
