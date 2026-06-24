// app/api/policies/route.ts
// 선택 사항: 클라이언트에서 정책 목록을 받아야 할 때 쓰는 프록시 라우트.
// 서버 컴포넌트에서 lib/youthApi의 함수를 직접 부르는 게 우선이고,
// 무한스크롤/검색 등 클라이언트 인터랙션이 필요할 때만 이 라우트를 씁니다.
// 인증키는 서버에만 머무르므로 안전합니다.

import { NextRequest, NextResponse } from "next/server";
import { getPolicies, CATEGORY_TO_LCLSF } from "@/lib/youthApi";

const REGION_ZIP_PREFIX: Record<string, string> = {
    "003002001": "11", // 서울
    "003002002": "26", // 부산
    "003002003": "27", // 대구
    "003002004": "28", // 인천
    "003002005": "29", // 광주
    "003002006": "30", // 대전
    "003002007": "31", // 울산
    "003002008": "36", // 세종
    "003002009": "41", // 경기
    "003002010": "51", // 강원
    "003002011": "43", // 충북
    "003002012": "44", // 충남
    "003002013": "52", // 전북
    "003002014": "46", // 전남
    "003002015": "47", // 경북
    "003002016": "48", // 경남
    "003002017": "50", // 제주
};

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

        // 지역 필터: zipCd 앞 2자리(광역시도 코드)로 매칭
        if (region && data.result?.youthPolicyList) {
            const prefix = REGION_ZIP_PREFIX[region];
            if (prefix) {
                data.result.youthPolicyList = data.result.youthPolicyList.filter((p) => {
                    if (!p.zipCd || p.zipCd.trim() === "") return true;
                    const codes = p.zipCd.split(",").map((c) => c.trim()).filter(Boolean);
                    return codes.some((c) => c.startsWith(prefix));
                });
                data.result.pagging.totCount = data.result.youthPolicyList.length;
            }
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