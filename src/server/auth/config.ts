import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "~/server/db";
import { login } from "~/server/services/areaManagerAuth";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = (credentials?.email ?? "").trim();
        const password = credentials?.password ?? "";
        if (!identifier || !password) return null;

        // E-mail: the shared stage-gated flow (verify → approve → PIN → login).
        // Stage-specific prompts are handled by the login page via
        // `areaManagerAuth.stage`; here we only allow or deny.
        if (identifier.includes("@")) {
          const result = await login({ email: identifier, password });
          if (!result.ok) return null;
          const data = result.data as {
            id: string;
            name: string;
            email: string;
            mobile: string;
          };
          return {
            id: data.id,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
          };
        }

        // Legacy phone-number sign-in (same DB row, bcrypt password).
        const manager = await db.areaManager.findFirst({
          where: { phoneNumber: identifier },
        });
        if (!manager || manager.isDeleted === true || manager.isActive === false) {
          return null;
        }
        if (!manager.isApproved) return null;
        const valid = await compare(password, manager.password);
        if (!valid) return null;
        return {
          id: manager.id,
          name: manager.fullName,
          email: manager.email,
          mobile: manager.phoneNumber,
        };
      },
    }),
  ],
  // No PrismaAdapter — JWT sessions only, no DB session storage.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id ?? token.sub;
        token.mobile = user.mobile;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = (token.id ?? token.sub) as string;
        session.user.mobile = token.mobile as string;
      }
      return session;
    },
  },
};
