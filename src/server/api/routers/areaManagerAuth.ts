import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  requestPassword,
  setPassword,
  stage,
} from "~/server/services/areaManagerAuth";

export const areaManagerAuthRouter = createTRPCRouter({
  /** State-first login hint: which stage is this e-mail at? */
  stage: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => stage(input.email)),

  /** Self-service "Forgot password" / re-send the set-password link. */
  requestPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => requestPassword(input.email)),

  /** Consume the single-use set-password link. */
  setPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        password: z.string().min(8),
        confirmPassword: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => setPassword(input)),
});
