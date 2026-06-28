import type { NextConfig } from "next";

const API_PROXY =
  process.env.VAP_API_PROXY_URL ?? "https://vap-api.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY}/:path*`,
      },
    ];
  },
};

export default nextConfig;
