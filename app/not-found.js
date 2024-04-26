import { redirect } from "next/navigation";

const NotFound = () => {
  redirect("/");

  return <></>;
};

export default NotFound;
