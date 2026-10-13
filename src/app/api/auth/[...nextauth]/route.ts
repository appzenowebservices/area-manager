import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/config";

const { handlers } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
