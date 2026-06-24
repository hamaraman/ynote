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

// 기관명에서 지역 코드 추출 (zipCd가 전국으로 코딩된 경우 fallback)
const REGION_KEYWORDS: [string, string[]][] = [
    ["003002001", ["서울"]],
    ["003002002", ["부산"]],
    ["003002003", ["대구"]],
    ["003002004", ["인천"]],
    ["003002005", ["광주"]],
    ["003002006", ["대전"]],
    ["003002007", ["울산"]],
    ["003002008", ["세종"]],
    ["003002009", ["경기"]],
    ["003002010", ["강원"]],
    ["003002011", ["충북", "충청북도"]],
    ["003002012", ["충남", "충청남도"]],
    ["003002013", ["전북", "전라북도"]],
    ["003002014", ["전남", "전라남도"]],
    ["003002015", ["경북", "경상북도"]],
    ["003002016", ["경남", "경상남도"]],
    ["003002017", ["제주"]],
];

function getInstRegion(instName: string): string | null {
    for (const [code, keywords] of REGION_KEYWORDS) {
        if (keywords.some((kw) => instName.includes(kw))) return code;
    }
    return null; // 중앙부처 등 → 전국
}

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
        // srchPolyBizSecd는 외부 API에서 실제로 필터링되지 않으므로 전달하지 않음
        // → 동일 pageNum/pageSize 조합끼리 Next.js fetch 캐시 공유
        // 지역 필터가 있으면 zipCd 필터링 후 결과가 줄어드므로 더 많이 가져옴
        const fetchSize = region ? Math.min(pageSize * 4, 200) : pageSize;
        const data = await getPolicies({
            plcyNm: keyword || undefined,
            lclsfNm,
            pageNum,
            pageSize: fetchSize,
        });

        // 지역 필터: zipCd 앞 2자리로 매칭, 전국코딩 정책은 기관명으로 2차 판별
        if (region && data.result?.youthPolicyList) {
            const prefix = REGION_ZIP_PREFIX[region];
            if (prefix) {
                const ALL_PREFIXES = new Set(Object.values(REGION_ZIP_PREFIX));
                data.result.youthPolicyList = data.result.youthPolicyList.filter((p) => {
                    if (!p.zipCd || p.zipCd.trim() === "") return true;
                    const codes = p.zipCd.split(",").map((c) => c.trim()).filter(Boolean);
                    const presentPrefixes = new Set(codes.map((c) => c.slice(0, 2)).filter((c) => ALL_PREFIXES.has(c)));
                    // zipCd가 전체 광역 10개 이상 포함 → 전국 코딩 의심, 기관명으로 판별
                    if (presentPrefixes.size >= 10) {
                        const instRegion = getInstRegion(p.sprvsnInstCdNm || "");
                        if (instRegion !== null) return instRegion === region;
                        return true; // 중앙부처 → 전국 표시
                    }
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
            headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "알 수 없는 오류";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}