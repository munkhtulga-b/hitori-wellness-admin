import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { redirectUnauthorized } from "./actions";

const fetchData = async (endpoint, method, body, serverToken) => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL;

  const token = Cookies.get("cms-token")
    ? Cookies.get("cms-token")
    : serverToken;

  try {
    const requestHeaders = {
      "Content-Type": "application/json",
    };

    const init = {
      method: method,
      headers: requestHeaders,
      cache: "no-store",
      next: {
        revalidate: 0,
      },
    };

    if (body) {
      init["body"] = JSON.stringify(body);
    }

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseURL}/${endpoint}`, init);

    const isOk = response.ok;
    const status = response.status;
    const data = await response.json();
    const range = response.headers.get("Content-Range");

    if (!isOk) {
      toast.error(data?.error?.message || "An error occured");

      // Redirects the user back to login page if their token has expired
      if (status === 401) {
        Cookies.remove("cms-token");
        redirectUnauthorized();
      }
    }

    return {
      isOk,
      status,
      data,
      range,
    };
  } catch (error) {
    return error;
  }
};

export default fetchData;
