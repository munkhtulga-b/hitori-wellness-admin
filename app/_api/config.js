import { toast } from "react-toastify";
import { redirectUnauthorized } from "./actions";
import Cookies from "js-cookie";

const fetchData = async (endpoint, method, body) => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL;

  try {
    const requestHeaders = {
      "Content-Type": "application/json",
      "X-User-Type": "0",
    };

    const init = {
      method: method,
      headers: requestHeaders,
      cache: "default",
    };

    if (process.env.NODE_ENV === "development") {
      init.headers["Authorization"] = `Bearer ${Cookies.get("access_token")}`;
    } else {
      init["credentials"] = "include";
    }

    if (body) {
      init["body"] = JSON.stringify(body);
    }

    const response = await fetch(`${baseURL}/${endpoint}`, init);

    const isOk = response.ok;
    const status = response.status;
    const data = await response.json();
    const range = response.headers.get("Content-Range");

    if (!isOk) {
      if (status === 401) {
        const accessResponse = await fetch(`${baseURL}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Type": "0",
          },
          credentials: "include",
        });
        if (accessResponse.ok && accessResponse.status !== 401) {
          window.location.reload();
        } else {
          Cookies.remove("session");
          redirectUnauthorized();
        }
      } else {
        toast.error(data?.error?.message || "An error occurred");
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
