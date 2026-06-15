import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicySlugs, getPolicyBySlug } from "@/lib/posts";
import { getPolicyDetail, getPoliciesByCategory, formatYmd } from "@/lib/youthApi";
import BookmarkButton from "@/components/BookmarkButton";

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
        return { title: markdownPolicy.title, description: markdownPolicy.description };
    }

    if (isPlcyNo(slug)) {
        const apiPolicy = await getPolicyDetail(slug);
        if (apiPolicy) {
            return { title: apiPolicy.plcyNm, description: apiPolicy.plcyExplnCn };
        }
    }

    return {};
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-slate-50/50 dark:bg-slate-800/40 px-6 py-4 border-b border-gray-100 dark:border-slate-800/60">
                <h2 className="font-bold text-lg flex items-center gap-2.5 text-gray-800 dark:text-gray-100">
                    <span className="text-xl">{icon}</span>
                    <span>{title}</span>
                </h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function InfoBadge({ icon, label, value }: { icon: string; label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2.5">
            <span className="text-lg">{icon}</span>
            <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{label}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</div>
            </div>
        </div>
    );
}

function ChecklistItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300">
            <span className="text-teal-600 dark:text-teal-400 font-bold mt-0.5">✓</span>
            <span>{text}</span>
        </li>
    );
}

export default async function PolicyPage({
                                             params,
                                         }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const markdownPolicy = await getPolicyBySlug(slug);

    if (markdownPolicy) {
        return (
            <article className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-4 flex justify-between items-center">
                    <Link
                        href={`/category/${markdownPolicy.categorySlug}`}
                        className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
                    >
                        <span>←</span> {markdownPolicy.category}
                    </Link>
                    <BookmarkButton policy={{
                        id: slug,
                        type: "markdown",
                        title: markdownPolicy.title,
                        description: markdownPolicy.description || "",
                        categorySlug: markdownPolicy.categorySlug,
                        categoryName: markdownPolicy.category,
                        aplyYmd: markdownPolicy.date
                    }} />
                </div>
                <div className="bg-teal-50 dark:bg-teal-950/20 rounded-2xl p-5 mb-8 border border-teal-100/50 dark:border-teal-900/20">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                            <div className="text-xs text-teal-700 dark:text-teal-400 mb-1">카테고리</div>
                            <div className="font-semibold text-teal-900 dark:text-teal-300">{markdownPolicy.category}</div>
                        </div>
                        <div>
                            <div className="text-xs text-teal-700 dark:text-teal-400 mb-1">작성일</div>
                            <div className="font-semibold text-teal-900 dark:text-teal-300">{markdownPolicy.date}</div>
                        </div>
                        {markdownPolicy.updated && (
                            <div>
                                <div className="text-xs text-teal-700 dark:text-teal-400 mb-1">최종 업데이트</div>
                                <div className="font-semibold text-teal-900 dark:text-teal-300">{markdownPolicy.updated}</div>
                            </div>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight text-gray-900 dark:text-gray-100">
                    {markdownPolicy.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">{markdownPolicy.description}</p>
                <div
                    className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-strong:text-gray-900 dark:prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: markdownPolicy.contentHtml }}
                />
            </article>
        );
    }

    if (!isPlcyNo(slug)) notFound();

    const apiPolicy = await getPolicyDetail(slug);
    if (!apiPolicy) notFound();

    const catSlug = getCategorySlug(apiPolicy.lclsfNm);
    const catName = getCategoryName(apiPolicy.lclsfNm);

    // 관련 정책 조회
    let relatedPolicies: Awaited<ReturnType<typeof getPoliciesByCategory>>["result"]["youthPolicyList"] = [];
    try {
        const relatedData = await getPoliciesByCategory(catSlug, 1, 6);
        relatedPolicies = (relatedData.result?.youthPolicyList ?? []).filter(p => p.plcyNo !== slug).slice(0, 4);
    } catch { /* ignore */ }

    // 키워드 추출
    const keywords = apiPolicy.plcyKywdNm?.split(",").filter(Boolean) || [];

    return (
        <article className="max-w-5xl mx-auto px-4 py-12">
            {/* 헤더 */}
            <div className="mb-6 flex justify-between items-center">
                <Link href={`/category/${catSlug}`} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    <span>←</span> {catName}
                </Link>
                <BookmarkButton policy={{
                    id: slug,
                    type: "api",
                    title: apiPolicy.plcyNm,
                    description: apiPolicy.plcyExplnCn,
                    categorySlug: catSlug,
                    categoryName: catName,
                    aplyYmd: apiPolicy.aplyYmd || "상시 신청",
                    sprvsnInstCdNm: apiPolicy.sprvsnInstCdNm
                }} />
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 dark:from-slate-900 dark:to-slate-800 border border-transparent dark:border-slate-800 rounded-3xl p-6 md:p-8 text-white mb-10 shadow-lg relative overflow-hidden">
                {/* Decorative background glow for dark mode */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none hidden dark:block" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none hidden dark:block" />

                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    <span className="text-xs px-3 py-1 bg-white/20 dark:bg-teal-500/20 text-white dark:text-teal-300 font-semibold rounded-full backdrop-blur-sm">{catName}</span>
                    {apiPolicy.mclsfNm && (
                        <span className="text-xs px-3 py-1 bg-white/20 dark:bg-slate-700 text-white dark:text-slate-300 rounded-full backdrop-blur-sm">{apiPolicy.mclsfNm}</span>
                    )}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight tracking-tight relative z-10 text-white dark:text-gray-100">
                    {apiPolicy.plcyNm}
                </h1>
                <p className="text-white/90 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-3xl relative z-10">
                    {apiPolicy.plcyExplnCn}
                </p>

                {/* 키워드 태그 */}
                {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                        {keywords.slice(0, 5).map((kw, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 bg-white/10 dark:bg-slate-800/60 text-white/95 dark:text-slate-300 rounded-lg">
                                #{kw.trim()}
                            </span>
                        ))}
                    </div>
                )}

                {/* 핵심 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 border-t border-white/10 dark:border-slate-800/80 pt-6 mt-6">
                    <div className="bg-white/10 dark:bg-slate-800/40 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-white/70 dark:text-gray-400 text-[11px] mb-1 font-medium flex items-center gap-1"><span>📅</span> 신청기간</div>
                        <div className="font-semibold text-sm">
                            {apiPolicy.aplyYmd ? (
                                <span className="line-clamp-2 text-xs md:text-sm" title={apiPolicy.aplyYmd}>{apiPolicy.aplyYmd}</span>
                            ) : "상시 신청"}
                        </div>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-800/40 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-white/70 dark:text-gray-400 text-[11px] mb-1 font-medium flex items-center gap-1"><span>🏛️</span> 주관기관</div>
                        <div className="font-semibold text-xs md:text-sm truncate" title={apiPolicy.sprvsnInstCdNm || ""}>
                            {apiPolicy.sprvsnInstCdNm || "-"}
                        </div>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-800/40 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-white/70 dark:text-gray-400 text-[11px] mb-1 font-medium flex items-center gap-1"><span>👤</span> 지원대상</div>
                        <div className="font-semibold text-xs md:text-sm truncate">
                            {apiPolicy.sprtTrgtAgeLmtYn === "Y"
                                ? `만 ${apiPolicy.sprtTrgtMinAge || 19}~${apiPolicy.sprtTrgtMaxAge || 34}세`
                                : "연령 제한 없음"}
                        </div>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-800/40 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-white/70 dark:text-gray-400 text-[11px] mb-1 font-medium flex items-center gap-1"><span>💼</span> 사업기간</div>
                        <div className="font-semibold text-xs md:text-sm truncate">
                            {apiPolicy.bizPrdBgngYmd ? `${formatYmd(apiPolicy.bizPrdBgngYmd)} ~ ${formatYmd(apiPolicy.bizPrdEndYmd)}` : "상시"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout: Left Column (Details) vs Right Column (Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 지원 내용 */}
                    {apiPolicy.plcySprtCn && (
                        <SectionCard icon="💰" title="지원 내용">
                            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/30 dark:border-amber-950/10 rounded-2xl p-5 text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {apiPolicy.plcySprtCn}
                            </div>
                        </SectionCard>
                    )}

                    {/* 지원 대상 */}
                    <SectionCard icon="👤" title="지원 대상">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/30 dark:border-teal-950/10 rounded-xl p-4">
                                <div className="text-xs text-teal-700 dark:text-teal-400 mb-1.5 font-semibold">연령 조건</div>
                                <div className="font-bold text-teal-900 dark:text-teal-300">
                                    {apiPolicy.sprtTrgtAgeLmtYn === "Y"
                                        ? `만 ${apiPolicy.sprtTrgtMinAge || 19}세 ~ 만 ${apiPolicy.sprtTrgtMaxAge || 34}세`
                                        : "연령 제한 없음"}
                                </div>
                            </div>
                            <div className="bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100/30 dark:border-teal-950/10 rounded-xl p-4">
                                <div className="text-xs text-teal-700 dark:text-teal-400 mb-1.5 font-semibold">소득 조건</div>
                                <div className="font-bold text-teal-900 dark:text-teal-300 whitespace-pre-wrap">
                                    {apiPolicy.earnEtcCn || "소득 제한 없음"}
                                </div>
                            </div>
                        </div>

                        {apiPolicy.addAplyQlfcCndCn && (
                            <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-950/10 rounded-xl p-4 mb-4">
                                <div className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-1">
                                    <span>💡</span> 추가 자격 조건
                                </div>
                                <div className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">{apiPolicy.addAplyQlfcCndCn}</div>
                            </div>
                        )}

                        {apiPolicy.ptcpPrpTrgtCn && (
                            <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-950/10 rounded-xl p-4">
                                <div className="text-xs font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-1">
                                    <span>⚠️</span> 참여 제한 대상
                                </div>
                                <div className="text-sm text-rose-900 dark:text-rose-300 whitespace-pre-wrap leading-relaxed">{apiPolicy.ptcpPrpTrgtCn}</div>
                            </div>
                        )}
                    </SectionCard>

                    {/* 신청 방법 */}
                    {apiPolicy.plcyAplyMthdCn && (
                        <SectionCard icon="📝" title="신청 방법">
                            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-xl p-5">
                                {apiPolicy.plcyAplyMthdCn}
                            </div>
                        </SectionCard>
                    )}

                    {/* 제출 서류 */}
                    {apiPolicy.sbmsnDcmntCn && (
                        <SectionCard icon="📋" title="제출 서류">
                            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-xl p-5">
                                {apiPolicy.sbmsnDcmntCn}
                            </div>
                        </SectionCard>
                    )}

                    {/* 심사 방법 */}
                    {apiPolicy.srngMthdCn && (
                        <SectionCard icon="🔍" title="심사 방법">
                            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-xl p-5">
                                {apiPolicy.srngMthdCn}
                            </div>
                        </SectionCard>
                    )}

                    {/* 참고 사항 */}
                    {apiPolicy.etcMttrCn && (
                        <SectionCard icon="ℹ️" title="참고 사항">
                            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-xl p-5">
                                {apiPolicy.etcMttrCn}
                            </div>
                        </SectionCard>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    {/* Quick Apply Action */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span>⚡</span> 빠른 신청
                        </h3>
                        <div className="space-y-3">
                            {apiPolicy.aplyUrlAddr ? (
                                <a
                                    href={apiPolicy.aplyUrlAddr}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 text-sm"
                                >
                                    <span>공식 신청 페이지 이동</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            ) : (
                                <a
                                    href="https://www.youthcenter.go.kr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 text-sm"
                                >
                                    <span>온통청년 신청 바로가기</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}

                            <Link
                                href={`/category/${catSlug}`}
                                className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium border border-gray-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                            >
                                다른 정책 둘러보기
                            </Link>
                        </div>
                    </div>

                    {/* Reference Links */}
                    {(apiPolicy.refUrlAddr1 || apiPolicy.refUrlAddr2) && (
                        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span>🔗</span> 참고 링크
                            </h3>
                            <ul className="space-y-2.5">
                                {apiPolicy.refUrlAddr1 && (
                                    <li>
                                        <a href={apiPolicy.refUrlAddr1} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium">
                                            <span>•</span>
                                            <span className="truncate break-all max-w-[170px]" title={apiPolicy.refUrlAddr1}>
                                                {new URL(apiPolicy.refUrlAddr1).hostname}
                                            </span>
                                            <span className="text-[10px] text-gray-400">↗</span>
                                        </a>
                                    </li>
                                )}
                                {apiPolicy.refUrlAddr2 && (
                                    <li>
                                        <a href={apiPolicy.refUrlAddr2} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium">
                                            <span>•</span>
                                            <span className="truncate break-all max-w-[170px]" title={apiPolicy.refUrlAddr2}>
                                                {new URL(apiPolicy.refUrlAddr2).hostname}
                                            </span>
                                            <span className="text-[10px] text-gray-400">↗</span>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Operations Metadata Info */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-xs text-gray-500 dark:text-gray-400 space-y-3">
                        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1 border-b border-gray-100 dark:border-slate-800 pb-2">📋 정책 정보 고시</h3>
                        <div className="flex justify-between border-b border-gray-50 dark:border-slate-850/50 pb-2">
                            <span>주관 기관</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{apiPolicy.sprvsnInstCdNm || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 dark:border-slate-850/50 pb-2">
                            <span>운영 기관</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{apiPolicy.operInstCdNm || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 dark:border-slate-850/50 pb-2">
                            <span>조회수</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{Number(apiPolicy.inqCnt).toLocaleString()}회</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 dark:border-slate-850/50 pb-2">
                            <span>최종 수정일</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{apiPolicy.lastMdfcnDt?.slice(0, 10) || "-"}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 pt-1">
                            <span>정책 번호</span>
                            <span>{apiPolicy.plcyNo}</span>
                        </div>
                    </div>

                    {/* Related Policies */}
                    {relatedPolicies.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span>📌</span> {catName} 관련 정책
                            </h3>
                            <div className="space-y-3">
                                {relatedPolicies.map((p) => (
                                    <Link key={p.plcyNo} href={`/policy/${p.plcyNo}`}
                                          className="block p-3.5 bg-slate-50 hover:bg-teal-50/20 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-gray-100/50 dark:border-slate-800/50 rounded-xl transition-all duration-200 group">
                                        <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{p.plcyNm}</h4>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{p.plcyExplnCn}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Notice Info */}
            <div className="mt-16 pt-6 border-t border-gray-100 dark:border-slate-800/80">
                <div className="flex items-start gap-2.5 text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    <span>📌</span>
                    <p>본 정보는 온통청년(youthcenter.go.kr) API를 통해 제공되며, 실시간 정책 상황에 따라 정보가 다를 수 있습니다. 신청 전에 반드시 주관 기관의 공식 채널을 통해 세부 조건을 재확인하시기 바랍니다.</p>
                </div>
            </div>
        </article>
    );
}