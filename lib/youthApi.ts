// lib/youthApi.ts
// 온통청년 청년정책 OPEN API (2.0) 호출 모듈
// 문서: 이용안내 > 오픈(OPEN) API 제공목록 > 청년정책API
// 엔드포인트: https://www.youthcenter.go.kr/go/ythip/getPlcy

const BASE_URL = "https://www.youthcenter.go.kr/go/ythip/getPlcy";

const API_KEY = process.env.YOUTH_API_KEY || "f559e151-e1c7-4455-9ebf-9422fe4941b2";

/** API 응답의 정책 1건 (출력결과 표 기준, 주요 필드 위주) */
export interface YouthPolicy {
    plcyNo: string; // 정책번호
    plcyNm: string; // 정책명
    plcyKywdNm: string | null; // 정책키워드명 (콤마 구분)
    plcyExplnCn: string; // 정책설명내용
    lclsfNm: string | null; // 정책대분류명
    mclsfNm: string | null; // 정책중분류명
    plcySprtCn: string; // 정책지원내용
    sprvsnInstCdNm: string; // 주관기관명
    operInstCdNm: string; // 운영기관명
    // 신청
    aplyYmd: string; // 신청기간 (예: "20260101 ~ 20261231")
    plcyAplyMthdCn: string; // 신청방법내용
    srngMthdCn: string; // 심사방법내용
    aplyUrlAddr: string; // 신청 URL
    sbmsnDcmntCn: string; // 제출서류내용
    // 자격
    sprtTrgtMinAge: string; // 지원대상 최소연령
    sprtTrgtMaxAge: string; // 지원대상 최대연령
    sprtTrgtAgeLmtYn: string; // 연령제한 여부 (Y/N)
    earnCndSeCd: string; // 소득조건 구분코드
    earnMinAmt: string; // 소득 최소금액
    earnMaxAmt: string; // 소득 최대금액
    earnEtcCn: string; // 소득 기타내용
    addAplyQlfcCndCn: string; // 추가 신청자격 조건
    ptcpPrpTrgtCn: string; // 참여제한 대상
    // 기타
    bizPrdBgngYmd: string; // 사업기간 시작
    bizPrdEndYmd: string; // 사업기간 종료
    etcMttrCn: string; // 기타사항
    refUrlAddr1: string; // 참고 URL 1
    refUrlAddr2: string; // 참고 URL 2
    zipCd: string; // 정책 거주지역코드
    inqCnt: string; // 조회수
    frstRegDt: string; // 최초등록일시
    lastMdfcnDt: string; // 최종수정일시
    // 추가 필드
    mrgSttsCd: string; // 결혼상태코드
    jobCd: string; // 취업상태코드
    schoolCd: string; // 재학상태코드
    sbizCd: string; // 사업구분코드
}

/** 응답 래퍼. 키 발급 후 실제 응답을 보고 필드명이 다르면 여기만 수정하면 됩니다. */
export interface YouthApiResponse {
    resultCode: number;
    resultMessage: string;
    result: {
        pagging: {
            totCount: number;
            pageNum: number;
            pageSize: number;
        };
        youthPolicyList: YouthPolicy[];
    };
}

export interface GetPoliciesParams {
    pageNum?: number;
    pageSize?: number;
    plcyNm?: string; // 정책명 검색
    plcyKywdNm?: string; // 키워드 검색 (콤마 구분)
    lclsfNm?: string; // 대분류 (콤마 구분)
    mclsfNm?: string; // 중분류 (콤마 구분)
    zipCd?: string; // 법정시군구코드 (콤마 구분)
    srchPolyBizSecd?: string; // 지역코드 (콤마 구분)
}

/** site 카테고리 slug -> API 정책대분류명(lclsfNm) 매핑.
 *  실제 API 응답 기반으로 2026-06-12 확인 완료. */
export const CATEGORY_TO_LCLSF: Record<string, string> = {
    finance: "금융･복지･문화",
    housing: "주거",
    job: "일자리",
    edu: "교육",
    life: "금융･복지･문화",
    region: "참여권리",
};

function buildUrl(params: GetPoliciesParams & { plcyNo?: string; pageType?: "1" | "2" }) {
    if (!API_KEY) {
        throw new Error("YOUTH_API_KEY 환경변수가 설정되지 않았습니다 (.env.local 확인).");
    }
    const sp = new URLSearchParams();
    sp.set("apiKeyNm", API_KEY);
    sp.set("rtnType", "json");
    sp.set("pageType", params.pageType ?? "1");
    sp.set("pageNum", String(params.pageNum ?? 1));
    sp.set("pageSize", String(params.pageSize ?? 10));

    if (params.plcyNo) sp.set("plcyNo", params.plcyNo);
    if (params.plcyNm) sp.set("plcyNm", params.plcyNm);
    if (params.plcyKywdNm) sp.set("plcyKywdNm", params.plcyKywdNm);
    if (params.lclsfNm) sp.set("lclsfNm", params.lclsfNm);
    if (params.mclsfNm) sp.set("mclsfNm", params.mclsfNm);
    if (params.zipCd) sp.set("zipCd", params.zipCd);
    if (params.srchPolyBizSecd) sp.set("srchPolyBizSecd", params.srchPolyBizSecd);

    return `${BASE_URL}?${sp.toString()}`;
}

/** 정책 목록 조회. 서버에서만 호출하세요(인증키 보호).
 *  ISR: next.revalidate로 캐싱 주기를 둬서 호출 한도를 아낍니다. */
export async function getPolicies(
    params: GetPoliciesParams = {},
    revalidateSec = 60 * 60 * 6 // 6시간마다 갱신
): Promise<YouthApiResponse> {
    if (!API_KEY) {
        console.warn("WARNING: YOUTH_API_KEY is not defined. Returning empty policy list.");
        return {
            resultCode: -1,
            resultMessage: "YOUTH_API_KEY is not defined",
            result: {
                pagging: { totCount: 0, pageNum: 1, pageSize: params.pageSize ?? 10 },
                youthPolicyList: []
            }
        };
    }
    const url = buildUrl({ ...params, pageType: "1" });
    const res = await fetch(url, { next: { revalidate: revalidateSec } });

    if (!res.ok) {
        console.error(`청년정책 API 호출 실패: HTTP ${res.status}`);
        return {
            resultCode: res.status,
            resultMessage: `HTTP ${res.status}`,
            result: {
                pagging: { totCount: 0, pageNum: params.pageNum ?? 1, pageSize: params.pageSize ?? 10 },
                youthPolicyList: [],
            },
        };
    }
    const data = (await res.json()) as YouthApiResponse;
    return data;
}

/** 카테고리 slug로 정책 목록 조회 */
export async function getPoliciesByCategory(
    categorySlug: string,
    pageNum = 1,
    pageSize = 12
): Promise<YouthApiResponse> {
    const lclsfNm = CATEGORY_TO_LCLSF[categorySlug];
    return getPolicies({ lclsfNm, pageNum, pageSize });
}

/** 정책 상세 조회 (pageType=2, plcyNo 지정) */
export async function getPolicyDetail(plcyNo: string): Promise<YouthPolicy | null> {
    if (!API_KEY) {
        console.warn("WARNING: YOUTH_API_KEY is not defined. Returning null policy detail.");
        return null;
    }
    const url = buildUrl({ plcyNo, pageType: "2", pageSize: 1, pageNum: 1 });
    const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });

    if (!res.ok) {
        console.error(`청년정책 상세 API 호출 실패: HTTP ${res.status}`);
        return null;
    }
    const data = (await res.json()) as YouthApiResponse;
    return data.result?.youthPolicyList?.[0] ?? null;
}

/** "20260101" 형태 날짜를 "2026.01.01"로, 신청기간 문자열을 보기 좋게 변환 */
export function formatYmd(ymd?: string): string {
    if (!ymd || ymd.length < 8) return ymd ?? "";
    return `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`;
}