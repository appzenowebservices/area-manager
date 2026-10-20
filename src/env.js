import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
const isProd = process.env.NODE_ENV === "production";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  
    server: {
    AUTH_SECRET: isProd ? z.string() : z.string().optional(),
    // AUTH_DISCORD_ID: isProd ? z.string() : z.string().optional(),
    // AUTH_DISCORD_SECRET: isProd ? z.string() : z.string().optional(),
    DATABASE_URL: isProd ? z.string().url() : z.string().url().optional(),
    MONGODB_URI: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AREA_MANAGER_APP_URL: z.string().url().optional(),
    PATRA_BASE_URL: z.string().url().optional(),
    PATRA_API_USER: z.string().optional(),
    PATRA_API_TOKEN: z.string().optional(),
    PATRA_PASSWORD_TEMPLATE_ID: z.string().optional(),
    SET_PASSWORD_JWT_SECRET: z.string().optional(),
    JWT_SECRET: z.string().optional(),
 
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: z.string().optional(),
    // Central ADDies backend (Express). Used by the set-password page to
    // consume the e-mailed single-use token.
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    // AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    // AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    AREA_MANAGER_APP_URL: process.env.AREA_MANAGER_APP_URL,
    PATRA_BASE_URL: process.env.PATRA_BASE_URL,
    PATRA_API_USER: process.env.PATRA_API_USER,
    PATRA_API_TOKEN: process.env.PATRA_API_TOKEN,
    PATRA_PASSWORD_TEMPLATE_ID: process.env.PATRA_PASSWORD_TEMPLATE_ID,
    SET_PASSWORD_JWT_SECRET: process.env.SET_PASSWORD_JWT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
