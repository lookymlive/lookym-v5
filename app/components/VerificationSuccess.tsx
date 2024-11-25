"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  message: string;
}

const VerificationSuccess: FC<Props> = ({ message }) => {
  const router = useRouter();
  const { update, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      update({ verified: true })
        .then(() => {
          router.replace("/");
          router.refresh();
        })
        .catch((error) => {
          console.error("Error updating session:", error);
        });
    }
  }, [status, router, update]);

  return (
    <div className="text-center px-4 pt-20 text-xl">
      {message && <p>{message}</p>}
      <p>Congrats! Your email is verified.</p>
    </div>
  );
};

export default VerificationSuccess;
