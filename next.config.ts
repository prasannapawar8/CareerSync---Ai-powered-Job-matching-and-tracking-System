import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse resolves its pdf.js worker at runtime. Bundling it with
  // Turbopack loses that worker file, so keep the package in Node's resolver.
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
