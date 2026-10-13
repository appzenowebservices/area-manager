import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "~/server/db";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.mobile?.trim();
        const password = credentials?.password;
        if (!identifier || !password) return null;

        // Area managers (shared DB): e-mail or phone number + bcrypt password.
        const manager = await db.areaManager.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { phoneNumber: identifier },
            ],
          },
        });

        if (manager) {
          if (manager.isActive === false) return null;
          const valid = await compare(password, manager.password);
          if (!valid) return null;
          return {
            id: manager.id,
            name: manager.fullName,
            email: manager.email,
            mobile: manager.phoneNumber,
          };
        }

        // Fallback: shared User accounts (legacy).
        const user = await db.user.findFirst({
          where: {
            OR: [{ mobile: identifier }, { email: identifier }],
          },
        });

        if (!user) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, mobile: user.mobile };
      },
    }),
  ],
  // No PrismaAdapter — JWT sessions only, no DB session storage. The adapter
  // also broke the production build at import time (page-data collection).
  session: {
    strategy: "jwt", // 👈 forces JWT sessions instead of DB
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.mobile = token.mobile as string;
      }
      return session;
    },
  },

};
