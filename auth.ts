import NextAuth, { NextAuthConfig, Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { signInSchema } from "@/app/utils/verificationSchema";
import UserModel, { createNewUser, IUser } from "@/app/models/user";
import startDb from "@/app/lib/db";

import type { User as AuthUser } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "user" | "store" | "admin";
    verified: boolean;
    avatar?: string;
    emailVerified: Date | null;
  }

  interface Session {
    user: AuthUser & {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      verified: boolean;
      role: "user" | "store" | "admin";
      emailVerified: Date | null;
    };
  }
}

export const config = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const result = signInSchema.safeParse(credentials);
          if (!result.success) {
            throw new Error("Please provide a valid email & password!");
          }

          const { email, password } = result.data;
          await startDb();
          const user = await UserModel.findOne({ email });
          if (!user) throw new Error("Email/Password mismatch!");

          const passwordMatch = await user.comparePassword(password);
          if (!passwordMatch) throw new Error("Email/Password mismatch!");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            avatar: user.avatar?.url,
            emailVerified: user.emailVerified || null,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
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
    jwt({ token, user, account, profile, trigger, isNewUser }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = (user as AuthUser & { avatar?: string }).avatar;
        token.verified = user.verified;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    session({ token, session }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.avatar = token.avatar as string | undefined;
      session.user.verified = token.verified as boolean;
      session.user.role = token.role as "user" | "store" | "admin";
      session.user.emailVerified = token.emailVerified as Date | null;
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
            name: profile.name || '',
            avatar: profile.picture ? { url: profile.picture } : undefined,
            verified: true,
            provider: 'google',
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
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);
