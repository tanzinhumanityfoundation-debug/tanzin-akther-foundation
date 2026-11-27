import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each(["/about", "/request-help", "/contact", "/privacy", "/admin"])("matches a page for %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(path);
  });

  it("includes all five public pages in the sitemap", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(["/", "/about", "/contact", "/privacy", "/request-help"]);
  });

  it("excludes the private admin area from the sitemap", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).not.toContain("/admin");
    expect(router.routesById["/admin"].options.staticData?.sitemap).toBe("exclude-subtree");
  });

  it("uses the published origin and does not invent lastmod dates", () => {
    const xml = sitemapXML("https://tanzinhumanityfoundation.lovable.app", [{ path: "/about" }]);
    expect(xml).toContain("<loc>https://tanzinhumanityfoundation.lovable.app/about</loc>");
    expect(xml).not.toContain("<lastmod>");
  });
});
