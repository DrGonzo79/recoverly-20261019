import type { NextConfig } from "next";

const repo = "recoverly-20261019";
const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true }
};
export default nextConfig;
