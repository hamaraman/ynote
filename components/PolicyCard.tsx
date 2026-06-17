"use client";

import Link from "next/link";
import BookmarkButton, { BookmarkedPolicy } from "./BookmarkButton";
import { YouthPolicy } from "@/lib/youthApi";
import { PolicyMeta } from "@/lib/posts";

interface PolicyCardProps {
    policy: YouthPolicy | PolicyMeta | BookmarkedPolicy;
    isMarkdown?: boolean;
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

const REGION_CODE_TO_NAME: Record<string, string> = {
    "003002001": "서울",
    "003002002": "부산",
    "003002003": "대구",
    "003002004": "인천",
    "003002005": "광주",
    "003002006": "대전",
    "003002007": "울산",
    "003002008": "세종",
    "003002009": "경기",
    "003002010": "강원",
    "003002011": "충북",
    "003002012": "충남",
    "003002013": "전북",
    "003002014": "전남",
    "003002015": "경북",
    "003002016": "경남",
    "003002017": "제주",
    "003002018": "전국",
};

function getRegionLabel(zipCd: string | null | undefined): string | null {
    if (!zipCd) return "전국";
    const codes = zipCd.split(",").map((c) => c.trim()).filter(Boolean);
    if (codes.length === 0) return "전국";
    if (codes.includes("003002018") || codes.length > 3) return null; // 전국이거나 너무 많으면 표시 생략
    return codes.map((c) => REGION_CODE_TO_NAME[c] ?? c).join("·");
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

export default function PolicyCard({ policy, isMarkdown = false }: PolicyCardProps) {
    let id: string;
    let title: string;
    let description: string;
    let categoryName: string;
    let categorySlug: string;
    let aplyYmd: string;
    let sprvsnInstCdNm: string | undefined;
    let supportContent: string | undefined;
    let ageLimit: string | undefined;
    let isMarkdownType = isMarkdown;

    if ("id" in policy) {
        const p = policy as BookmarkedPolicy;
        id = p.id;
        title = p.title;
        description = p.description || "";
        categoryName = p.categoryName;
        categorySlug = p.categorySlug;
        aplyYmd = p.aplyYmd || "상시 신청";
        sprvsnInstCdNm = p.sprvsnInstCdNm;
        isMarkdownType = p.type === "markdown";
    } else if (isMarkdown) {
        const p = policy as PolicyMeta;
        id = p.slug;
        title = p.title;
        description = p.description || "";
        categoryName = p.category;
        categorySlug = p.categorySlug;
        aplyYmd = p.date;
    } else {
        const p = policy as YouthPolicy;
        id = p.plcyNo;
        title = p.plcyNm;
        description = p.plcyExplnCn;
        categorySlug = getCategorySlug(p.lclsfNm);
        categoryName = getCategoryName(p.lclsfNm);
        aplyYmd = p.aplyYmd || "상시 신청";
        sprvsnInstCdNm = p.sprvsnInstCdNm;
        supportContent = p.plcySprtCn;
        if (p.sprtTrgtAgeLmtYn === "Y" && p.sprtTrgtMinAge) {
            ageLimit = `만 ${p.sprtTrgtMinAge}${p.sprtTrgtMaxAge ? `~${p.sprtTrgtMaxAge}` : ""}세`;
        }
    }

    const bookmarkedData: BookmarkedPolicy = {
        id,
        type: isMarkdownType ? "markdown" : "api",
        title,
        description,
        categorySlug,
        categoryName,
        aplyYmd,
        sprvsnInstCdNm,
    };

    const keywords = !isMarkdownType && !("id" in policy) && (policy as YouthPolicy).plcyKywdNm
        ? (policy as YouthPolicy).plcyKywdNm!.split(",").filter(Boolean).slice(0, 2)
        : [];
    const regionLabel = !isMarkdownType && !("id" in policy)
        ? getRegionLabel((policy as YouthPolicy).zipCd)
        : null;

    return (
        <div className="relative group h-full">
            {/* Hover floating Bookmark Button */}
            <div className="absolute top-4 right-4 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <BookmarkButton policy={bookmarkedData} variant="icon" />
            </div>

            <Link
                href={`/policy/${id}`}
                className="flex flex-col justify-between h-full bg-white border border-gray-200/60 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(20,184,166,0.08)] hover:border-teal-500/30 transition-all duration-300 ease-out"
            >
                <div>
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5 pr-8">
                        <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg dark:bg-teal-950/40 dark:text-teal-300">
                            {isMarkdownType ? "📖 읽어보기" : categoryName}
                        </span>
                        {!isMarkdownType && !("id" in policy) && (policy as YouthPolicy).mclsfNm && (
                            <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                                {(policy as YouthPolicy).mclsfNm}
                            </span>
                        )}
                        {regionLabel && regionLabel !== "전국" && (
                            <span className="text-[11px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-950/30 dark:text-blue-400 font-medium">
                                📍 {regionLabel}
                            </span>
                        )}
                        {keywords.map((kw, i) => (
                            <span key={i} className="text-[11px] px-2 py-1 bg-teal-50/40 text-teal-600 rounded-lg dark:bg-teal-950/20 dark:text-teal-400">
                                #{kw.trim()}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-200 line-clamp-2 mb-2 leading-snug text-[16px]">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {description}
                    </p>

                    {/* Support Details (API Only) */}
                    {supportContent && (
                        <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-950/20 rounded-xl p-3 mb-4 flex items-start gap-1.5">
                            <span className="text-amber-500 text-xs mt-0.5" aria-hidden="true">💰</span>
                            <p className="text-[12px] text-amber-800 dark:text-amber-300 font-medium line-clamp-2 leading-relaxed">
                                {supportContent}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-500 pt-3.5 border-t border-gray-100 mt-auto">
                    <span className="flex items-center gap-1">
                        <span>📅</span> {aplyYmd}
                    </span>
                    {sprvsnInstCdNm && (
                        <span className="flex items-center gap-1 line-clamp-1 max-w-[120px]" title={sprvsnInstCdNm}>
                            <span>🏛️</span> {sprvsnInstCdNm}
                        </span>
                    )}
                    {ageLimit && (
                        <span className="flex items-center gap-1">
                            <span>👤</span> {ageLimit}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
