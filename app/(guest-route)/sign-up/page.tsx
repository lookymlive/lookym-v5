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
  const [error, setError] = useState<string | null>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeType, setStoreType] = useState("");
  const [description, setDescription] = useState("");

  const handleRoleChange = (value: string) => {
    setRole(value);
    setShowStoreDetails(value === 'store');
  };

  const handleValidation = () => {
    let hasError = false;
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields");
      hasError = true;
    }
    
    if (email.trim() && !email.includes('@')) {
      setError("Please enter a valid email address");
      hasError = true;
    }
    
    if (role === 'store' && (!storeName.trim() || !storeType.trim())) {
      setError("Please fill in all store details");
      hasError = true;
    }
    
    return !hasError;
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
      onSubmit={handleSubmit}
      error={(error || state?.error) as string | undefined}
    >
      <Input
        type="text"
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        isRequired
        isInvalid={!!(!name.trim() && error !== null)}
        errorMessage={!name.trim() && error !== null ? "Name is required" : undefined}
        className="max-w-xs"
      />
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isRequired
        isInvalid={!!((!email.trim() || (email.trim() && !email.includes('@'))) && error !== null)}
        errorMessage={
          !email.trim() && error !== null 
            ? "Email is required" 
            : email.trim() && !email.includes('@') && error !== null 
              ? "Please enter a valid email address" 
              : undefined
        }
        className="max-w-xs"
      />
      <Input
        type="password"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isRequired
        isInvalid={!!(!password.trim() && error !== null)}
        errorMessage={!password.trim() && error !== null ? "Password is required" : undefined}
        className="max-w-xs"
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
            isRequired
            isInvalid={!!(!storeName.trim() && error !== null && role === 'store')}
            errorMessage={!storeName.trim() && error !== null && role === 'store' ? "Store name is required" : undefined}
            className="max-w-xs"
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
          <Input
            type="text"
            label="Store Type"
            placeholder="Enter store type"
            value={storeType}
            onChange={(e) => setStoreType(e.target.value)}
            isRequired
            isInvalid={!!(!storeType.trim() && error !== null && role === 'store')}
            errorMessage={!storeType.trim() && error !== null && role === 'store' ? "Store type is required" : undefined}
            className="max-w-xs"
          />
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