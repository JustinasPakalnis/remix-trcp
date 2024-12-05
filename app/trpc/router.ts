import { router } from "./trpc";

import { itemRouter } from "./routers/itemRouter";
import { historyRouter } from "./routers/historyRouter";

export const appRouter = router({
  item: itemRouter,
  history: historyRouter,
});

export type AppRouter = typeof appRouter;
