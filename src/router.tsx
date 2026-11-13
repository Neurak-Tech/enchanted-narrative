import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Single-page story: always land at the top on full reload (see index scroll reset).
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
