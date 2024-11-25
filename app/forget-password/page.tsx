"use client";

import { FC } from "react";
import AuthForm from "../components/AuthForm";
import { Input } from "@nextui-org/react";
import { generatePassResetLink } from "../actions/auth";
import { useActionState } from "react";

interface Props {
  children: React.ReactNode;
  action: (payload: FormData) => void;
  error?: string;
  message?: string;
  btnLabel: string;
  title: string;
  description: string;
  footerItems: Array<{
    label: string;
    href: string;
  }>;
}

const ForgetPassword: FC<Props> = () => {
  const [state, action] = useActionState(generatePassResetLink, {});

  return (
    <AuthForm
      action={action}
      error={state.error}
      message={state.message}
      btnLabel="Send Reset Link"
      title="Reset Password"
      description="Enter your email address and we'll send you instructions to reset your password."
      footerItems={[
        { label: "Remember your password?", linkText: "Sign In", link: "/sign-in" },
        { label: "Don't have an account?", linkText: "Sign Up", link: "/sign-up" }
      ]}
    >
      <Input
        name="email"
        label="Email"
        placeholder="Enter your email address"
        type="email"
        variant="bordered"
        isRequired
        autoComplete="email"
      />
    </AuthForm>
  );
};

export default ForgetPassword;