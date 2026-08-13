import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPolicySlugs, getPolicyBySlug } from "@/lib/posts";
import { getPolicyDetail, formatYmd } from "@/lib/youthApi";
import { getDDay } from "@/lib/utils";
import PolicyDetailClient from "./PolicyDetailClient";

function isPlcyNo(slug: string): boolean {
    return /^\d{10,}/.test(slug);
}

function getCategorySlug(lclsfNm: string | null): string {
    const map: Record<string, string> = {
        "금융･복지･문화": "life",
        "주거": "housing",
        "일자리": "job",
        "교육": "edu",
        "참여권리": "region",
    };
    return map[lclsfNm ?? ""] ?? "life";
}

function getCategoryName(lclsfNm: string | null): string {
    const map: Record<string, string> = {
        "금융･복지･문화": "금융/자산",
        "주거": "주거",
        "일자리": "일자리",
        "교육": "교육/문화",
        "참여권리": "참여권리",
    };
    return map[lclsfNm ?? ""] ?? "전체";
}

export async function generateStaticParams() {
    const markdownSlugs = getAllPolicySlugs().map((slug) => ({ slug }));
    return markdownSlugs;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const markdownPolicy = await getPolicyBySlug(slug);
    if (markdownPolicy) {
        const title = markdownPolicy.title;
        const description = markdownPolicy.description || "";
        return {
            title,
            description,
            keywords: [title, markdownPolicy.category, "Y노트", "청년 정책", "정부 지원"],
            openGraph: { title, description, type: "article" },
            twitter: { card: "summary_large_image", title, description },
            alternates: { canonical: `/policy/${slug}` },
        };
    }

    if (isPlcyNo(slug)) {
        const apiPolicy = await getPolicyDetail(slug);
        if (apiPolicy) {
            const title = apiPolicy.plcyNm;
            const description = apiPolicy.plcyExplnCn || "";
            const keywords = [
                title,
                ...(apiPolicy.plcyKywdNm?.split(",").map((k) => k.trim()).filter(Boolean) ?? []),
                "Y노트",
                "청년 정책",
                "정부 지원",
            ];
            return {
                title,
                description,
                keywords,
                openGraph: { title, description, type: "article" },
                twitter: { card: "summary_large_image", title, description },
                alternates: { canonical: `/policy/${slug}` },
            };
        }
    }

    return {};
}

// Custom hardcoded detail values for mock policies shown in layout to look identical
const MOCK_POLICY_DETAILS: Record<string, any> = {
    "youth-rent-support": {
        id: "youth-rent-support",
        title: "청년 월세 한시 특별지원",
        category: "주거",
        categorySlug: "housing",
        description: "월 최대 20만원씩 최대 12개월 지원",
        targetTags: ["만 19~34세", "무주택", "소득기준"],
        deadline: "2024.06.30",
        dday: "D-12",
        amount: "월 최대 20만원 x 12개월",
        targetDesc: "만 19~34세 무주택 청년",
        details: {
            intro: "경제적 어려움을 겪는 청년들의 주거비 부담을 덜어드리기 위해 월세를 지원하는 사업입니다.",
            projectPeriod: "2024.01.01 ~ 2024.12.31",
            applyPeriod: "2024.02.26 ~ 2024.06.30",
            agency: "국토교통부",
            contact: "1600-0777",
            eligibility: "만 19세~34세 부모와 별도로 거주하는 무주택 청년으로, 청년 독립가구 소득이 기준 중위소득 60% 이하이면서 원가구 소득이 기준 중위소득 100% 이하여야 합니다.",
            supportDetails: "실제 납부하는 임차료 범위 내에서 월 최대 20만 원씩 최대 12개월(회)에 걸쳐 지원합니다. (보증금 및 관리비 제외)",
            applyMethod: "복지로 홈페이지(www.bokjiro.go.kr) 또는 거주지 주소지 관할 행정복지센터(주민센터)에 직접 방문하여 신청할 수 있습니다.",
            documents: "임대차계약서, 임차료 납부 증빙 서류, 통장 사본, 가족관계증명서 등이 필요합니다.",
            faq: "Q. 부모님과 같이 살고 있는데 지원받을 수 있나요?\nA. 아니오, 부모님과 세대를 분리하여 별도로 거주하는 무주택 청년만 대상입니다."
        },
        applyUrl: "https://www.bokjiro.go.kr"
    },
    "youth-work-experience": {
        id: "youth-work-experience",
        title: "청년 일경험 지원사업",
        category: "취업",
        categorySlug: "job",
        description: "월 최대 234만원 지원",
        targetTags: ["만 15~34세", "미취업 청년", "경력형성"],
        deadline: "2024.06.21",
        dday: "D-3",
        amount: "월 최대 234만원",
        targetDesc: "만 15~34세 미취업 청년",
        details: {
            intro: "청년들이 직무를 경험하고 일자리를 찾을 수 있도록 실무 기회를 제공하는 프로그램입니다.",
            projectPeriod: "2024.01.01 ~ 2024.12.31",
            applyPeriod: "2024.03.02 ~ 2024.06.21",
            agency: "고용노동부",
            contact: "1350",
            eligibility: "신청일 기준 만 15세 이상 34세 이하의 미취업 청년이 대상입니다.",
            supportDetails: "참여 기간 동안 주 20~40시간 근무 기준 월 최대 234만원의 참여 수당 및 일경험 학습 멘토링을 지원합니다.",
            applyMethod: "고용노동부 청년일경험 홈페이지를 통해 온라인으로 원하는 직무와 참여 기업을 선택하여 신청할 수 있습니다.",
            documents: "참여 신청서, 개인정보동의서, 졸업증명서 또는 재학증명서 등이 필요합니다.",
            faq: "Q. 대학 재학생도 참여 가능한가요?\nA. 예, 졸업 예정자나 휴학생도 미취업 상태인 경우 참여 가능합니다."
        },
        applyUrl: "https://www.work.go.kr"
    },
    "learning-card": {
        id: "learning-card",
        title: "국민내일배움카드",
        category: "교육",
        categorySlug: "edu",
        description: "최대 500만원 지원",
        targetTags: ["취업준비생", "직장인", "직무교육"],
        deadline: "상시신청",
        dday: "상시",
        amount: "최대 500만원",
        targetDesc: "취업준비생, 직장인 등",
        details: {
            intro: "일자리를 구하고 있는 취업준비생이나 이직을 준비하는 재직자들에게 직업훈련 비용을 지원하는 카드입니다.",
            projectPeriod: "연중 상시",
            applyPeriod: "연중 상시",
            agency: "고용노동부",
            contact: "1350",
            eligibility: "대한민국 국민이라면 누구나 신청 가능합니다. (공무원, 사립학교 교직원, 일정 소득 이상의 자영업자 등 제외)",
            supportDetails: "5년간 300만원에서 최대 500만원의 훈련비를 지원하며, 일부 직종의 경우 훈련 수당도 추가로 지급합니다.",
            applyMethod: "직업훈련포털 HRD-Net 홈페이지(www.hrd.go.kr) 또는 가까운 고용센터에 직접 방문 신청이 가능합니다.",
            documents: "신분증, 계좌 발급 신청서, 자격 증빙 서류 등이 필요합니다.",
            faq: "Q. 유효기간은 어떻게 되나요?\nA. 카드 발급일로부터 5년간 사용할 수 있습니다."
        },
        applyUrl: "https://www.hrd.go.kr"
    },
    "pre-startup-package": {
        id: "pre-startup-package",
        title: "청년 창업 지원사업",
        category: "창업",
        categorySlug: "startup",
        description: "최대 1억원 지원",
        targetTags: ["예비창업자", "3년이내", "사업화"],
        deadline: "2024.07.05",
        dday: "D-18",
        amount: "최대 1억원 지원",
        targetDesc: "예비창업자, 3년 이내 창업자",
        details: {
            intro: "혁신적인 창업 아이디어를 보유한 예비 청년 창업자들에게 사업화 자금과 멘토링을 지원하는 사업입니다.",
            projectPeriod: "2024.01.01 ~ 2024.12.31",
            applyPeriod: "2024.05.10 ~ 2024.07.05",
            agency: "중소벤처기업부",
            contact: "1357",
            eligibility: "공고일 기준 사업자 등록이 없는 만 39세 이하의 예비 창업자 및 3년 이내 초기 창업자가 대상입니다.",
            supportDetails: "시제품 제작, 지식재산권 취득, 마케팅 등에 소요되는 사업화 자금을 최대 1억 원(평균 5,000만 원)까지 지원합니다.",
            applyMethod: "K-Startup 홈페이지(www.k-startup.go.kr)를 통해 온라인 접수 신청합니다.",
            documents: "창업 사업계획서, 신분증 양식 등이 필요합니다.",
            faq: "Q. 직장에 재직 중이어도 신청할 수 있나요?\nA. 예, 신청 시점에는 상관없으나 협약 체결 후 사업자등록을 완료해야 합니다."
        },
        applyUrl: "https://www.k-startup.go.kr"
    }
};

export default async function PolicyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Check if it's one of the mock policies
    if (MOCK_POLICY_DETAILS[slug]) {
        return <PolicyDetailClient policy={MOCK_POLICY_DETAILS[slug]} />;
    }

    // 1. Check local markdown guide
    const markdownPolicy = await getPolicyBySlug(slug);
    if (markdownPolicy) {
        const ddayVal = getDDay(markdownPolicy.date, markdownPolicy.updated || markdownPolicy.date);
        const mappedPolicy = {
            id: slug,
            title: markdownPolicy.title,
            category: markdownPolicy.category,
            categorySlug: markdownPolicy.categorySlug,
            description: markdownPolicy.description || "",
            targetTags: markdownPolicy.tags || [],
            deadline: markdownPolicy.date,
            dday: ddayVal !== null ? `D-${ddayVal}` : "상시",
            amount: "상세 가이드 참고",
            targetDesc: "만 19~34세 청년",
            details: {
                intro: markdownPolicy.description || "이 정책의 가이드라인 요약정보입니다.",
                projectPeriod: "연중 진행",
                applyPeriod: markdownPolicy.date,
                agency: "보건복지부 / 행정안전부 등",
                contact: "고객센터 문의",
                eligibility: "각 시도별 공고 및 본문 내용을 상세히 참조하시기 바랍니다.",
                supportDetails: "본문 설명과 관련 링크의 공식 사이트에서 한도를 확인해보실 수 있습니다.",
                applyMethod: "아래 제공된 가이드를 상세히 읽고 신청처 링크를 확인하세요.",
                documents: "주민등록등본, 본인 신분증, 소득 및 자산 증빙 자료 등 기본 서류 구비 요망.",
                faq: "자세한 설명은 관련 본문 가이드북 내용을 참조 바랍니다."
            },
            applyUrl: "/search"
        };
        return <PolicyDetailClient policy={mappedPolicy} />;
    }

    // 2. Check API policy
    if (!isPlcyNo(slug)) notFound();

    const apiPolicy = await getPolicyDetail(slug);
    if (!apiPolicy) notFound();

    const catSlug = getCategorySlug(apiPolicy.lclsfNm);
    const catName = getCategoryName(apiPolicy.lclsfNm);
    const ddayVal = getDDay(apiPolicy.aplyYmd, apiPolicy.bizPrdEndYmd);

    const mappedPolicy = {
        id: slug,
        title: apiPolicy.plcyNm,
        category: catName,
        categorySlug: catSlug,
        description: apiPolicy.plcyExplnCn,
        targetTags: apiPolicy.plcyKywdNm?.split(",").map(k => k.trim()).filter(Boolean) || [],
        deadline: apiPolicy.aplyYmd ? apiPolicy.aplyYmd.slice(0, 10) : "상시신청",
        dday: ddayVal !== null ? `D-${ddayVal}` : "상시",
        amount: apiPolicy.plcySprtCn?.slice(0, 50) || "상세 내용 확인",
        targetDesc: apiPolicy.sprtTrgtAgeLmtYn === "Y"
            ? `만 ${apiPolicy.sprtTrgtMinAge || 19}~${apiPolicy.sprtTrgtMaxAge || 34}세 청년`
            : "연령 제한 없음",
        details: {
            intro: apiPolicy.plcyExplnCn,
            projectPeriod: apiPolicy.bizPrdBgngYmd ? `${formatYmd(apiPolicy.bizPrdBgngYmd)} ~ ${formatYmd(apiPolicy.bizPrdEndYmd)}` : "상시",
            applyPeriod: apiPolicy.aplyYmd || "상시 신청",
            agency: apiPolicy.sprvsnInstCdNm || "대한민국 정부",
            contact: apiPolicy.operInstCdNm || "해당 고객센터",
            eligibility: `${apiPolicy.earnEtcCn || ""}\n${apiPolicy.addAplyQlfcCndCn || ""}\n${apiPolicy.ptcpPrpTrgtCn ? `참여제한: ${apiPolicy.ptcpPrpTrgtCn}` : ""}`,
            supportDetails: apiPolicy.plcySprtCn,
            applyMethod: apiPolicy.plcyAplyMthdCn || "공식 사이트 참고",
            documents: apiPolicy.sbmsnDcmntCn || "기본 제출 서류 없음",
            faq: apiPolicy.etcMttrCn || "특이사항 및 추가 고시 내용 없음"
        },
        applyUrl: apiPolicy.aplyUrlAddr
    };

    return <PolicyDetailClient policy={mappedPolicy} />;
}