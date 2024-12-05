import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "~/db";

export const historyRouter = router({
  getAllHistory: publicProcedure.query(async () => {
    return prisma.history.findMany();
  }),

  insertHistory: publicProcedure
    .input(
      z.object({
        name: z.string(),
        comment: z.string().optional(),
        itemId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.history.create({
        data: {
          name: input.name,
          comment: input.comment || "No comment",
          itemId: input.itemId,
        },
      });
    }),
});
