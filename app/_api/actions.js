"use server";

import { redirect } from "next/navigation";

export const redirectUnauthorized = () => {
  redirect("/auth/login");
};
