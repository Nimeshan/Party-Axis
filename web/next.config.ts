import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Avoid picking up a package-lock.json in a parent folder (e.g. home) as the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
