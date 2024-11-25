"use client";
import { FC, useState } from "react";
import { Input } from "@nextui-org/react";
import AuthForm from "@/app/components/AuthForm";
import { useFormState } from "react-dom";
import { continueWithCredentials } from "@/app/actions/auth";
import type { AuthResponse } from "@/app/actions/auth";

interface Props {}

const SignIn: FC<Props> = () => {
  const [state, formAction] = useFormState<AuthResponse, FormData>(
    continueWithCredentials,
    {
      error: null,
      success: false
    }
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleValidation = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    setError(""); // Clear error message if validation passes
    return true;
  };

  const handleSubmit = (formData: FormData) => {
    if (handleValidation()) {
      formData.append("email", email);
      formData.append("password", password);

      formAction(formData);
    }
  };

  return (
    <AuthForm
      footerItems={[
        { label: "Create an account", linkText: "Sign Up", link: "/sign-up" },
        {
          label: "Having trouble",
          linkText: "Forget password",
          link: "/forget-password",
        },
      ]}
      btnLabel="Sign In"
      title="Log In"
      action={handleSubmit}
      error={error || (state?.error ?? undefined)}
    >
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        classNames={{
          input: "bg-transparent hover:bg-white/10 transition-colors",
          inputWrapper: "bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all border-2 border-white/20",
        }}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        classNames={{
          input: "bg-transparent hover:bg-white/10 transition-colors",
          inputWrapper: "bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all border-2 border-white/20",
        }}
      />
    </AuthForm>
  );
};

export default SignIn;
