import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

// OpenNext(Cloudflare): next dev 중에도 getCloudflareContext()로 바인딩에 접근 가능하게 함.
// 프로덕션 빌드에는 영향 없음.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();
