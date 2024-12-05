import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "~/db";

export const itemRouter = router({
  getAllItems: publicProcedure.query(async () => {
    return prisma.item.findMany();
  }),

  insertItem: publicProcedure
    .input(
      z.object({
        title: z.string(),
        value: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.item.create({
        data: {
          title: input.title,
          value: input.value,
        },
      });
    }),
});
