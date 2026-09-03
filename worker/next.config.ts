import type { NextConfig } from "next";

/* GitHub Pages размещает статические ресурсы проекта в подпапке /ceem-kiosk. */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = "/ceem-kiosk";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      assetPrefix: pagesBasePath,
      trailingSlash: true,
    }
  : {};

export default nextConfig;
