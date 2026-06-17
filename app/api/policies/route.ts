// app/api/policies/route.ts
// 선택 사항: 클라이언트에서 정책 목록을 받아야 할 때 쓰는 프록시 라우트.
// 서버 컴포넌트에서 lib/youthApi의 함수를 직접 부르는 게 우선이고,
// 무한스크롤/검색 등 클라이언트 인터랙션이 필요할 때만 이 라우트를 씁니다.
// 인증키는 서버에만 머무르므로 안전합니다.

import { NextRequest, NextResponse } from "next/server";
import { getPolicies, CATEGORY_TO_LCLSF } from "@/lib/youthApi";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || searchParams.get("cat");
    const keyword = searchParams.get("q") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const userAge = searchParams.get("age") ? Number(searchParams.get("age")) : undefined;
    const pageNum = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("size") ?? "24");

    try {
        const lclsfNm = category ? CATEGORY_TO_LCLSF[category] : undefined;
        const data = await getPolicies({
            plcyNm: keyword || undefined,
            lclsfNm,
            srchPolyBizSecd: region || undefined,
            pageNum,
            pageSize,
        });

        // 지역 필터: API(srchPolyBizSecd)가 완전히 강제하지 않으므로 zipCd로 후처리
        if (region && region !== "003002018" && data.result?.youthPolicyList) {
            data.result.youthPolicyList = data.result.youthPolicyList.filter((p) => {
                if (!p.zipCd) return true;
                const codes = p.zipCd.split(",").map((c) => c.trim());
                return codes.some((c) => c === "" || c === region || c === "003002018");
            });
            data.result.pagging.totCount = data.result.youthPolicyList.length;
        }

        // 나이 필터: API가 지원하지 않으므로 서버에서 직접 필터링
        if (userAge !== undefined && data.result?.youthPolicyList) {
            data.result.youthPolicyList = data.result.youthPolicyList.filter((p) => {
                if (p.sprtTrgtAgeLmtYn !== "Y") return true;
                const min = p.sprtTrgtMinAge ? Number(p.sprtTrgtMinAge) : 0;
                const max = p.sprtTrgtMaxAge ? Number(p.sprtTrgtMaxAge) : 99;
                return userAge >= min && userAge <= max;
            });
            data.result.pagging.totCount = data.result.youthPolicyList.length;
        }

        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "알 수 없는 오류";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}