import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext({ req }: { req: Request }) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
