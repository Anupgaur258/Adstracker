import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Disabled: incompatible with dynamic [id] routes

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "assets.mixkit.co" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },

  turbopack: {},

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;