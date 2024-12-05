import { appRouter } from "~/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "~/trpc/context";

export const loader = async ({ request }: { request: Request }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createContext({ req: request }),
  });
};

export const action = async ({ request }: { request: Request }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createContext({ req: request }),
  });
};
