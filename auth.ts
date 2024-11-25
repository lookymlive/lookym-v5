import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { signInSchema } from "@/app/utils/verificationSchema";
import UserModel, { createNewUser } from "@/app/models/user";
import startDb from "@/app/lib/db";
import { isValidObjectId } from "mongoose";

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  role: "user" | "store" | "admin";
  emailVerified?: Date | null;
}

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

class CustomError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
  code = "custom_error";
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
  update: unstable_update,
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const result = signInSchema.safeParse(credentials);
          if (!result.success)
            throw new CustomError("Please provide a valid email & password!");

          const { email, password } = result.data;
          await startDb();
          const user = await UserModel.findOne({ email });
          if (!user) throw new CustomError("Email/Password mismatch!");

          const passwordMatch = await user.comparePassword(password);
          if (!passwordMatch) throw new CustomError("Email/Password mismatch!");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            avatar: user.avatar?.url,
          };
        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError("Something went wrong, try again!");
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          role: user.role,
        };
      }
      return token;
    },
    async session({ token, session }) {
      if (token.user) session.user = token.user as SessionUserProfile;
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider === "google" && profile?.email) {
        try {
          await startDb();
          const user = await UserModel.findOne({ email: profile.email });
          if (user) return true;

          const newUser = {
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            verified: true,
          };

          await createNewUser(newUser);
          return true;
        } catch (error) {
          console.log("Error inside signIn callback: ", error);
          return false;
        }
      }
      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
