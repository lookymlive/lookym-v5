"use client";

import { FC } from "react";
import VerificationFormSubmit from "@/app/components/VerificationFormSubmit";
import { useFormState } from "react-dom";
import { generateVerificationLink } from "@/app/actions/auth";

interface Props {
  visible?: boolean;
}

const message = "Please check your inbox to verify your email.";
const errorMessage = "Didn't get the link?";

const VerificationStatus: FC<Props> = ({ visible }) => {
  const [state, formAction] = useFormState(generateVerificationLink, {
    success: false,
    error: null
  });

  if (!visible) return null;

  return (
    <div className="text-center p-2">
      {state.success ? (
        <p>{message}</p>
      ) : (
        <form action={formAction} className="text-center">
          <p>{message}</p>
          <div>
            {errorMessage} <VerificationFormSubmit />
          </div>
        </form>
      )}
    </div>
  );
};

export default VerificationStatus;
