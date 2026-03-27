/*
 * Questo file contiene la configurazione Next.js del progetto, inclusa la root esplicita di Turbopack.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: currentDirectory,
  },
};

export default nextConfig;
