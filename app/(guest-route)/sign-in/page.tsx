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
  const [error, setError] = useState<string | null>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return false;
    }
    
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      try {
        await formAction(formData);
      } catch (error) {
        setError("Invalid email or password");
      }
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
      title="Welcome Back"
      error={error ? "Invalid email or password" : undefined}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <Input
          isRequired
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-xs"
          isInvalid={(!email.trim() || (email.trim() && !validateEmail(email))) && error !== null ? true : false}
          errorMessage={!email.trim() ? "Email is required" : (email.trim() && !validateEmail(email) ? "Please enter a valid email address" : "")}
        />
        <Input
          isRequired
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="max-w-xs"
          isInvalid={!password.trim() && error !== null}
          errorMessage={!password.trim() ? "Password is required" : ""}
        />
      </div>
    </AuthForm>
  );
};

export default SignIn;
