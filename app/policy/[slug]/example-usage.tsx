// app/policy/[slug]/example-usage.tsx
// 사용 예시 — 서버 컴포넌트에서 인증키 노출 없이 직접 호출하는 패턴.
// 실제로는 카테고리 페이지(app/category/[slug]/page.tsx)에 녹여 쓰면 됩니다.

import { getPoliciesByCategory, formatYmd } from "@/lib/youthApi";

// 서버 컴포넌트 (async)
export default async function CategoryPolicies({ slug }: { slug: string }) {
    const data = await getPoliciesByCategory(slug, 1, 12);

    // 응답 방어: API 에러 시 빈 배열
    if (data.resultCode !== 200) {
        return <p className="text-red-500">정책 정보를 불러오지 못했습니다.</p>;
    }

    const policies = data.result?.youthPolicyList ?? [];
    const total = data.result?.pagging?.totCount ?? 0;

    return (
        <section>
            <p className="text-sm text-gray-500 mb-4">총 {total.toLocaleString()}개 정책</p>
            <ul className="grid gap-4 sm:grid-cols-2">
                {policies.map((p) => (
                    <li key={p.plcyNo} className="rounded-xl border p-5 hover:shadow-md transition">
                        <span className="text-xs text-blue-600">{p.mclsfNm}</span>
                        <h3 className="mt-1 font-semibold text-lg">{p.plcyNm}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.plcyExplnCn}</p>

                        <dl className="mt-3 text-xs text-gray-500 space-y-1">
                            <div>
                                <dt className="inline font-medium">신청기간 </dt>
                                <dd className="inline">{p.aplyYmd || "상시"}</dd>
                            </div>
                            {p.sprtTrgtAgeLmtYn === "Y" && (
                                <div>
                                    <dt className="inline font-medium">대상연령 </dt>
                                    <dd className="inline">
                                        만 {p.sprtTrgtMinAge}~{p.sprtTrgtMaxAge}세
                                    </dd>
                                </div>
                            )}
                        </dl>

                        <a
                            href={`/policy/${p.plcyNo}`}
                            className="mt-4 inline-block text-sm font-medium text-blue-600"
                        >
                            자세히 보기 →
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}