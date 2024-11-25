"use server";
import { z } from "zod"; 
import crypto from "crypto"; // For generating random tokens
import nodemailer from "nodemailer"; 
import startDb from "@/app/lib/db";  
import UserModel, { createNewUser } from "@/app/models/user";  
import VerificationTokenModel from "@/app/models/verificationToken"; 
import {
  passwordValidationSchema,
  signInSchema,
} from "@/app/utils/verificationSchema";
import { auth, signIn, unstable_update } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import mail from "@/app/utils/mail";
import streamifier from "streamifier";
import cloud from "@/app/lib/cloud";
import { uploadFileToCloud } from "@/app/utils/fileHandler";
import PassResetTokenModel from "@/app/models/passwordResetToken";
import { genSaltSync, hashSync } from "bcrypt";

export const continueWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

const handleVerificationToken = async (user: {
  id: string;
  name: string;
  email: string;
}) => {
  const userId = user.id;
  const token = crypto.randomBytes(36).toString("hex");
  //   randomToken = 1234hgh = db (hash)

  await startDb();
  await VerificationTokenModel.findOneAndDelete({ userId });
  await VerificationTokenModel.create({ token, userId });
  const link = `${process.env.VERIFICATION_LINK}?token=${token}&userId=${userId}`;
  await mail.sendVerificationMail({ link, name: user.name, to: user.email });
};

const signUpSchema = z.object({
  name: z.string().trim().min(3, "Invalid name!"),
  email: z.string().email("Invalid email!"),
  password: z.string().min(8, "Password is too short!"),
  role: z.enum(['user', 'store']).default('user'),
  storeName: z.string().optional(),
  storeType: z.enum(['clothing', 'shoes', 'other']).optional(),
  description: z.string().optional(),
});

export interface AuthResponse {
  error: string | null;
  success: boolean;
}

export const signUp = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  const result = signUpSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
    role: data.get("role"),
    storeName: data.get("storeName"),
    storeType: data.get("storeType"),
    description: data.get("description"),
  });

  if (!result.success) {
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const { email, name, password, role, storeName, storeType, description } = result.data;

  await startDb();
  const oldUser = await UserModel.findOne({ email });
  if (oldUser) return { success: false, error: "User already exists!" };

  const userData: any = {
    name,
    email,
    password,
    role,
    provider: "credentials",
    verified: false,
  };

  if (role === 'store') {
    userData.storeDetails = {
      storeName,
      storeType,
      description,
    };
  }

  const user = await createNewUser(userData);

  // send verification email
  await handleVerificationToken({ email, id: user._id.toString(), name });
  await signIn("credentials", { email, password, redirectTo: "/" });

  return { success: true };
};

export const continueWithCredentials = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  try {
    const result = signInSchema.safeParse({
      email: data.get("email"),
      password: data.get("password"),
    });
    if (!result.success)
      return { success: false, errors: result.error.formErrors.fieldErrors };

    const { email, password } = result.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    let errorMsg = "";
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      redirect("/");
    } else if (error instanceof AuthError) {
      errorMsg = error.message;
    } else {
      errorMsg = (error as any).message;
    }
    return { error: errorMsg, success: false };
  }
};

interface VerificationResponse {
  success?: boolean;
}
export const generateVerificationLink = async (
  state: VerificationResponse
): Promise<VerificationResponse> => {
  const session = await auth();
  if (!session) return { success: false };

  const user = await UserModel.findById(session.user.id);
  if (user?.verified) {
    // user is already verified
    return { success: false };
  }

  const { email, id, name } = session.user;
  await handleVerificationToken({ email, id, name });
  return { success: true };
};

export const updateProfileInfo = async (data: FormData) => {
  const session = await auth();
  if (!session) return;

  const userInfo: { name?: string; avatar?: { id: string; url: string } } = {};

  const name = data.get("name");
  const avatar = data.get("avatar");
  if (typeof name === "string" && name.trim().length >= 3) {
    userInfo.name = name;
  }

  if (avatar instanceof File && avatar.type.startsWith("image")) {
    const result = await uploadFileToCloud(avatar);
    if (result) {
      userInfo.avatar = { id: result.public_id, url: result.secure_url };
    }

    // const arrayBuffer = await avatar.arrayBuffer()
    // const buffer: Buffer = Buffer.from(arrayBuffer)

    // const stream = cloud.uploader.upload_stream({}, (err, result) => {
    //   if(err) throw err
    //   else

    // })

    // streamifier.createReadStream(buffer).pipe(stream)
  }

  await startDb();
  await UserModel.findByIdAndUpdate(session.user.id, {
    ...userInfo,
  });
  await unstable_update({
    user: {
      ...session.user,
      name: userInfo.name,
      avatar: userInfo.avatar?.url,
    },
  });
};

interface ResetPassResponse {
  message?: string;
  error?: string;
}

export async function generatePassResetLink(
  state: ResetPassResponse,
  data: FormData
): Promise<ResetPassResponse> {
  const email = data.get("email");
  if (!email || typeof email !== "string")
    return { error: "Invalid email!" };

  await startDb();
  const user = await UserModel.findOne({ email });
  if (!user) return { message: "If the email exists, you will receive a reset link." };

  // Check for existing non-expired tokens
  const existingToken = await PassResetTokenModel.findOne({
    userId: user.id,
    used: false,
    expires: { $gt: new Date() }
  });

  if (existingToken) {
    return { message: "If you haven't received the email, please check your spam folder." };
  }

  // Generate new token
  const token = crypto.randomBytes(36).toString("hex");
  await PassResetTokenModel.create({
    token,
    userId: user.id
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL is not defined!");

  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await mail.sendPassResetMail({
    to: email,
    name: user.name,
    link: resetLink
  });

  return { message: "If the email exists, you will receive a reset link." };
}

export async function updatePassword(
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> {
  const result = passwordValidationSchema.safeParse({
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
    token: data.get("token"),
  });

  if (!result.success) return { error: result.error.errors[0].message };

  const { password, token } = result.data;
  await startDb();

  const resetToken = await PassResetTokenModel.findOne({
    token,
    used: false,
    expires: { $gt: new Date() }
  });

  if (!resetToken) return { error: "Invalid or expired token!" };

  if (resetToken.isExpired()) {
    return { error: "Token has expired!" };
  }

  const user = await UserModel.findById(resetToken.userId);
  if (!user) return { error: "User not found!" };

  // Hash the new password
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);

  // Update password and mark token as used
  await Promise.all([
    UserModel.findByIdAndUpdate(user._id, { password: hashedPassword }),
    PassResetTokenModel.findByIdAndUpdate(resetToken._id, { used: true })
  ]);

  return { success: true };
}
