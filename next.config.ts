import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ynote.kr" }],
        destination: "https://ynote.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
