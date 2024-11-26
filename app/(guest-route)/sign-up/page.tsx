"use client";

import { FC, useState } from "react";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import AuthForm from "@/app/components/AuthForm";
import { useFormState } from "react-dom";
import { signUp } from "@/app/actions/auth";

interface Props {}

const SignUp: FC<Props> = () => {
  const [state, formAction] = useFormState(signUp, {
    error: null,
    success: false
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [description, setDescription] = useState("");

  const handleRoleChange = (value: string) => {
    setRole(value);
    setShowStoreDetails(value === 'store');
  };

  const handleValidation = () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return false;
    }
    
    if (role === 'store' && (!storeName || !storeType)) {
      setError("Store details are required");
      return false;
    }
    
    setError(""); // Clear error if validation passes
    return true;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      if (role === 'store') {
        formData.append("storeName", storeName);
        formData.append("storeType", storeType);
        formData.append("description", description);
      }

      formAction(formData);
    }
  };

  return (
    <AuthForm
      footerItems={[
        {
          label: "Already have an account",
          linkText: "Sign In",
          link: "/sign-in",
        },
      ]}
      btnLabel="Create Account"
      title="Sign Up"
      action={handleSubmit}
      error={(error || state?.error) as string | undefined}
    >
      <Input
        type="text"
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Select
        label="Account Type"
        placeholder="Select account type"
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
      >
        <SelectItem key="user" value="user">User Account</SelectItem>
        <SelectItem key="store" value="store">Store Account</SelectItem>
      </Select>

      {showStoreDetails && (
        <>
          <Input
            type="text"
            label="Store Name"
            placeholder="Enter store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <Select
            label="Store Type"
            placeholder="Select store type"
            value={storeType}
            onChange={(e) => setStoreType(e.target.value)}
          >
            <SelectItem key="clothing" value="clothing">Clothing</SelectItem>
            <SelectItem key="shoes" value="shoes">Shoes</SelectItem>
            <SelectItem key="other" value="other">Other</SelectItem>
          </Select>
          <Textarea
            label="Description"
            placeholder="Enter store description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      )}
    </AuthForm>
  );
};

export default SignUp;