import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid Email!"),
  password: z
    .string({ required_error: "Password is required!" })
    .trim()
    .min(3, "Password is too short!"),
});

export const passwordValidationSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long."),
    userId: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });
