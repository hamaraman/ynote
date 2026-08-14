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

function normalizeExternalUrl(value?: string | null): string | undefined {
    if (!value) return undefined;
    const url = value.trim();
    if (!url) return undefined;

    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
    } catch {
        return undefined;
    }
}

export async function generateStaticParams() {
    return getAllPolicySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const markdownPolicy = await getPolicyBySlug(slug);

    if (markdownPolicy) {
        const title = markdownPolicy.title;
        const description = markdownPolicy.description || "";
        return {
            title,
            description,
            keywords: [title, markdownPolicy.category, "청년노트", "청년 정책", "정부 지원"],
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
            return {
                title,
                description,
                keywords: [title, ...(apiPolicy.plcyKywdNm?.split(",").map((k) => k.trim()).filter(Boolean) ?? []), "청년노트", "청년 정책", "정부 지원"],
                openGraph: { title, description, type: "article" },
                twitter: { card: "summary_large_image", title, description },
                alternates: { canonical: `/policy/${slug}` },
            };
        }
    }

    return {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const markdownPolicy = await getPolicyBySlug(slug);
    if (markdownPolicy) {
        const ddayVal = getDDay(markdownPolicy.date, markdownPolicy.updated || markdownPolicy.date);
        const applicationUrl = markdownPolicy.applicationUrl;
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
            targetDesc: "정책별 공고 기준 확인",
            details: {
                intro: markdownPolicy.description || "이 정책의 가이드라인 요약정보입니다.",
                projectPeriod: "공식 공고 기준",
                applyPeriod: markdownPolicy.date,
                agency: "공식 공고 및 운영기관 확인",
                contact: "공식 신청처 고객센터 문의",
                eligibility: "정책별 공식 공고 및 본문 내용을 상세히 참조하시기 바랍니다.",
                supportDetails: "본문 설명과 공식 신청처의 최신 공고에서 지원 기준과 한도를 확인해 주세요.",
                applyMethod: markdownPolicy.applicationLinkKind === "official"
                    ? "상단의 ‘공식 신청처로 이동’ 버튼을 눌러 포털 또는 공고 페이지에서 최신 접수 일정과 신청 메뉴를 확인해 주세요."
                    : "공식 신청 링크가 아직 등록되지 않았습니다. 해당 정책의 운영기관 공고와 본문 안내를 확인해 주세요.",
                documents: "공식 공고에서 요구하는 제출 서류를 확인해 주세요.",
                faq: "정확한 접수 일정과 대상은 공식 공고 기준으로 확인해 주세요.",
            },
            application: applicationUrl
                ? {
                    url: applicationUrl,
                    kind: markdownPolicy.applicationLinkKind ?? "official" as const,
                    label: markdownPolicy.applicationLinkLabel,
                }
                : { kind: "unavailable" as const },
        };

        return <PolicyDetailClient policy={mappedPolicy} />;
    }

    if (!isPlcyNo(slug)) notFound();

    const apiPolicy = await getPolicyDetail(slug);
    if (!apiPolicy) notFound();

    const catSlug = getCategorySlug(apiPolicy.lclsfNm);
    const catName = getCategoryName(apiPolicy.lclsfNm);
    const ddayVal = getDDay(apiPolicy.aplyYmd, apiPolicy.bizPrdEndYmd);
    const directApplicationUrl = normalizeExternalUrl(apiPolicy.aplyUrlAddr);
    const officialReferenceUrl = normalizeExternalUrl(apiPolicy.refUrlAddr1) || normalizeExternalUrl(apiPolicy.refUrlAddr2);

    const mappedPolicy = {
        id: slug,
        title: apiPolicy.plcyNm,
        category: catName,
        categorySlug: catSlug,
        description: apiPolicy.plcyExplnCn,
        targetTags: apiPolicy.plcyKywdNm?.split(",").map((k) => k.trim()).filter(Boolean) || [],
        deadline: apiPolicy.aplyYmd ? apiPolicy.aplyYmd.slice(0, 10) : "상시신청",
        dday: ddayVal !== null ? `D-${ddayVal}` : "상시",
        amount: apiPolicy.plcySprtCn?.slice(0, 50) || "상세 내용 확인",
        targetDesc: apiPolicy.sprtTrgtAgeLmtYn === "Y" ? `만 ${apiPolicy.sprtTrgtMinAge || 19}~${apiPolicy.sprtTrgtMaxAge || 34}세 청년` : "연령 제한 없음",
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
            faq: apiPolicy.etcMttrCn || "특이사항 및 추가 고시 내용 없음",
        },
        application: directApplicationUrl
            ? { url: directApplicationUrl, kind: "direct" as const, label: "바로 신청하기" }
            : officialReferenceUrl
                ? { url: officialReferenceUrl, kind: "official" as const, label: "공식 공고·신청처로 이동" }
                : { kind: "unavailable" as const },
    };

    return <PolicyDetailClient policy={mappedPolicy} />;
}
