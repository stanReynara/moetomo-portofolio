import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
		unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-92760cc6862345509bd9b0867e90c2c6.r2.dev',
        port: '',
        pathname: '/**', // This allows all paths under this domain
      },
    ],
  },
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
