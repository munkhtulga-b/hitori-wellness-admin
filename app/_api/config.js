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
      cache: "default",
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
      if (status === 401) {
        const refreshToken =
          localStorage.getItem("user-storage")?.state?.user?.token;
        const accessResponse = await fetch(`${baseURL}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (accessResponse.ok) {
          const { data } = await accessResponse.json();
          Cookies.set("token", data?.tokens?.access_token);
        } else if( accessResponse.status === 401){
          Cookies.remove("token");
          redirectUnauthorized();
        } else{
          toast.error("An error occurred while refreshing token");
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
