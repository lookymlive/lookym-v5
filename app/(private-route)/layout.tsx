import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PrivateLayout: FC<Props> = async ({ children }) => {
  const session = await auth();

  if (!session) return redirect("/sign-in");

  return <>{children}</>;
};

export default PrivateLayout;
