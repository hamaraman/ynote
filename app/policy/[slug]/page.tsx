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
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <span>{icon}</span> {title}
                </h2>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    );
}

function InfoBadge({ icon, label, value }: { icon: string; label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2">
            <span className="text-base">{icon}</span>
            <div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm font-medium">{value}</div>
            </div>
        </div>
    );
}

function ChecklistItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2 py-1">
            <span className="text-teal-600 mt-0.5">✓</span>
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
                        className="text-sm text-teal-600 hover:underline"
                    >
                        ← {markdownPolicy.category}
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
                <div className="bg-teal-50 rounded-xl p-4 mb-8">
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <div className="text-xs text-teal-700 mb-1">카테고리</div>
                            <div className="font-medium text-teal-900">{markdownPolicy.category}</div>
                        </div>
                        <div>
                            <div className="text-xs text-teal-700 mb-1">작성일</div>
                            <div className="font-medium text-teal-900">{markdownPolicy.date}</div>
                        </div>
                        {markdownPolicy.updated && (
                            <div>
                                <div className="text-xs text-teal-700 mb-1">최종 업데이트</div>
                                <div className="font-medium text-teal-900">{markdownPolicy.updated}</div>
                            </div>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {markdownPolicy.title}
                </h1>
                <p className="text-gray-600 text-lg mb-8">{markdownPolicy.description}</p>
                <div
                    className="prose prose-gray max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-a:text-teal-600 prose-strong:text-gray-900"
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
        <article className="max-w-4xl mx-auto px-4 py-12">
            {/* 헤더 */}
            <div className="mb-6 flex justify-between items-center">
                <Link href={`/category/${catSlug}`} className="text-sm text-teal-600 hover:underline">
                    ← {catName}
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

            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 md:p-8 text-white mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-3 py-1 bg-white/20 rounded-full">{catName}</span>
                    {apiPolicy.mclsfNm && (
                        <span className="text-xs px-3 py-1 bg-white/20 rounded-full">{apiPolicy.mclsfNm}</span>
                    )}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                    {apiPolicy.plcyNm}
                </h1>
                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
                    {apiPolicy.plcyExplnCn}
                </p>

                {/* 키워드 태그 */}
                {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {keywords.slice(0, 5).map((kw, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 bg-white/20 rounded-full">
                                #{kw.trim()}
                            </span>
                        ))}
                    </div>
                )}

                {/* 핵심 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/70 text-xs mb-1">📅 신청기간</div>
                        <div className="font-medium">
                            {apiPolicy.aplyYmd ? (
                                <span className="text-sm">{apiPolicy.aplyYmd}</span>
                            ) : "상시 신청"}
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/70 text-xs mb-1">🏛️ 주관기관</div>
                        <div className="font-medium text-sm">{apiPolicy.sprvsnInstCdNm || "-"}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/70 text-xs mb-1">👤 지원대상</div>
                        <div className="font-medium text-sm">
                            {apiPolicy.sprtTrgtAgeLmtYn === "Y"
                                ? `만 ${apiPolicy.sprtTrgtMinAge || 19}~${apiPolicy.sprtTrgtMaxAge || 34}세`
                                : "연령 제한 없음"}
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-white/70 text-xs mb-1">📂 사업기간</div>
                        <div className="font-medium text-sm">
                            {formatYmd(apiPolicy.bizPrdBgngYmd)} ~ {formatYmd(apiPolicy.bizPrdEndYmd)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 주요 내용 */}
            <div className="space-y-6">
                {/* 지원 내용 */}
                {apiPolicy.plcySprtCn && (
                    <SectionCard icon="💰" title="지원 내용">
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{apiPolicy.plcySprtCn}</p>
                        </div>
                    </SectionCard>
                )}

                {/* 지원 대상 */}
                <SectionCard icon="👤" title="지원 대상">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                            <div className="text-sm text-teal-700 mb-2 font-medium">연령 조건</div>
                            <div className="font-semibold text-teal-900">
                                {apiPolicy.sprtTrgtAgeLmtYn === "Y"
                                    ? `만 ${apiPolicy.sprtTrgtMinAge || 19}세 ~ 만 ${apiPolicy.sprtTrgtMaxAge || 34}세`
                                    : "연령 제한 없음"}
                            </div>
                        </div>
                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                            <div className="text-sm text-teal-700 mb-2 font-medium">소득 조건</div>
                            <div className="font-semibold text-teal-900 whitespace-pre-wrap">
                                {apiPolicy.earnEtcCn || "소득 제한 없음"}
                            </div>
                        </div>
                    </div>

                    {apiPolicy.addAplyQlfcCndCn && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                            <div className="text-sm font-semibold text-blue-800 mb-2">추가 자격 조건</div>
                            <div className="text-blue-900 whitespace-pre-wrap">{apiPolicy.addAplyQlfcCndCn}</div>
                        </div>
                    )}

                    {apiPolicy.ptcpPrpTrgtCn && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                            <div className="text-sm font-semibold text-red-800 mb-2">참여 제한 대상</div>
                            <div className="text-red-900 whitespace-pre-wrap">{apiPolicy.ptcpPrpTrgtCn}</div>
                        </div>
                    )}
                </SectionCard>

                {/* 신청 방법 */}
                {apiPolicy.plcyAplyMthdCn && (
                    <SectionCard icon="📝" title="신청 방법">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.plcyAplyMthdCn}
                        </div>
                    </SectionCard>
                )}

                {/* 제출 서류 */}
                {apiPolicy.sbmsnDcmntCn && (
                    <SectionCard icon="📋" title="제출 서류">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.sbmsnDcmntCn}
                        </div>
                    </SectionCard>
                )}

                {/* 심사 방법 */}
                {apiPolicy.srngMthdCn && (
                    <SectionCard icon="🔍" title="심사 방법">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.srngMthdCn}
                        </div>
                    </SectionCard>
                )}

                {/* 참고 사항 */}
                {apiPolicy.etcMttrCn && (
                    <SectionCard icon="ℹ️" title="참고 사항">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.etcMttrCn}
                        </div>
                    </SectionCard>
                )}

                {/* 신청 바로가기 */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-lg font-bold mb-4">신청하기</h2>
                    <div className="flex flex-wrap gap-4">
                        {apiPolicy.aplyUrlAddr ? (
                            <a
                                href={apiPolicy.aplyUrlAddr}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                정책 상세 보기 & 신청하기
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ) : (
                            <a
                                href="https://www.youthcenter.go.kr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                온통청년에서 신청하기
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                        <Link
                            href={`/category/${catSlug}`}
                            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            다른 정책 보기
                        </Link>
                    </div>
                </div>

                {/* 참고 링크 */}
                {(apiPolicy.refUrlAddr1 || apiPolicy.refUrlAddr2) && (
                    <SectionCard icon="🔗" title="참고 링크">
                        <ul className="space-y-3">
                            {apiPolicy.refUrlAddr1 && (
                                <li>
                                    <a href={apiPolicy.refUrlAddr1} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center gap-2 text-teal-600 hover:underline">
                                        <span>→</span>
                                        <span className="break-all">{new URL(apiPolicy.refUrlAddr1).hostname}</span>
                                    </a>
                                </li>
                            )}
                            {apiPolicy.refUrlAddr2 && (
                                <li>
                                    <a href={apiPolicy.refUrlAddr2} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center gap-2 text-teal-600 hover:underline">
                                        <span>→</span>
                                        <span className="break-all">{new URL(apiPolicy.refUrlAddr2).hostname}</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </SectionCard>
                )}

                {/* 관련 정책 */}
                {relatedPolicies.length > 0 && (
                    <SectionCard icon="📌" title={`${catName} 다른 정책`}>
                        <div className="grid md:grid-cols-2 gap-4">
                            {relatedPolicies.map((p) => (
                                <Link key={p.plcyNo} href={`/policy/${p.plcyNo}`}
                                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{p.plcyNm}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{p.plcyExplnCn}</p>
                                </Link>
                            ))}
                        </div>
                    </SectionCard>
                )}
            </div>

            {/* 푸터 */}
            <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2 text-sm text-gray-500">
                    <span>📌</span>
                    <p>본 정보는 온통청년(youthcenter.go.kr) API를 통해 제공되며, 정확한 내용은 해당 기관에 확인하시기 바랍니다. 정책 정보는 변경될 수 있습니다.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <span>조회수: {Number(apiPolicy.inqCnt).toLocaleString()}</span>
                    <span>•</span>
                    <span>최근 업데이트: {apiPolicy.lastMdfcnDt?.slice(0, 10)}</span>
                    <span>•</span>
                    <span>정책번호: {apiPolicy.plcyNo}</span>
                </div>
            </div>
        </article>
    );
}