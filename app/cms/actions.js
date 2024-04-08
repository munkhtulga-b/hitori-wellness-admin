"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const cookieStore = cookies();

export const logUserOut = () => {
  cookieStore.delete("token");
  redirect("/auth/login");
};
