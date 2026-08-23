import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.status !== "ACTIVE") return null;

        const passwordMatch = await compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});

export type UserRole = "SUPER_ADMIN" | "ADMINISTRATOR" | "EDITOR" | "CONTENT_STAFF";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMINISTRATOR: 3,
  EDITOR: 2,
  CONTENT_STAFF: 1,
};

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageUsers(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMINISTRATOR";
}

export function canPublish(role: UserRole): boolean {
  return role !== "CONTENT_STAFF";
}
