import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function isValidPassword(password: string): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  }

  return Boolean(
    process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD,
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!adminEmail || !email || !password) {
          return null;
        }

        const emailMatches = email === adminEmail.trim().toLowerCase();
        const passwordMatches = await isValidPassword(password);

        if (!emailMatches || !passwordMatches) {
          return null;
        }

        return {
          id: "portfolio-admin",
          email: adminEmail,
          name: "Portfolio Admin",
        };
      },
    }),
  ],
};
