import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ISR/데이터 캐시(revalidate)를 R2에 저장해 워커 인스턴스 간 공유.
// wrangler.jsonc의 r2_buckets(NEXT_INC_CACHE_R2_BUCKET) 바인딩과 짝을 이룸.
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
    incrementalCache: r2IncrementalCache,
});

// Next 16 기본 Turbopack 빌드 출력이 OpenNext 서버 핸들러와 런타임에서 어긋나
// (components.ComponentMod.handler is not a function) → webpack 빌드로 강제.
config.buildCommand = "next build --webpack";

export default config;
