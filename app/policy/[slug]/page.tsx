import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPolicySlugs, getPolicyBySlug } from "@/lib/posts";
import { getPolicyDetail, formatYmd } from "@/lib/youthApi";

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

function InfoCard({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{value}</div>
        </div>
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
                <div className="mb-4">
                    <Link
                        href={`/category/${markdownPolicy.categorySlug}`}
                        className="text-sm text-teal-600 hover:underline"
                    >
                        ← {markdownPolicy.category}
                    </Link>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {markdownPolicy.title}
                </h1>
                <p className="text-gray-600 mb-2">{markdownPolicy.description}</p>
                <p className="text-sm text-gray-400 mb-8 border-b border-gray-200 pb-6">
                    작성: {markdownPolicy.date}
                    {markdownPolicy.updated && markdownPolicy.updated !== markdownPolicy.date && ` · 업데이트: ${markdownPolicy.updated}`}
                </p>
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

    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-4">
                <Link href={`/category/${catSlug}`} className="text-sm text-teal-600 hover:underline">
                    ← {apiPolicy.lclsfNm ?? "전체 정책"}
                </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {apiPolicy.plcyNm}
            </h1>
            <p className="text-gray-600 text-lg mb-6">{apiPolicy.plcyExplnCn}</p>

            <div className="bg-teal-50 rounded-xl p-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-xs text-teal-700 mb-1">신청기간</div>
                        <div className="font-medium text-teal-900">
                            {apiPolicy.aplyYmd || "상시 신청"}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-teal-700 mb-1">주관기관</div>
                        <div className="font-medium text-teal-900">{apiPolicy.sprvsnInstCdNm || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-teal-700 mb-1">조회수</div>
                        <div className="font-medium text-teal-900">{Number(apiPolicy.inqCnt).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-teal-700 mb-1">최근 업데이트</div>
                        <div className="font-medium text-teal-900">{apiPolicy.lastMdfcnDt?.slice(0, 10)}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {apiPolicy.plcySprtCn && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>💰</span> 지원 내용
                        </h2>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.plcySprtCn}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <span>👤</span> 지원 대상
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-2">연령</div>
                            <div className="font-medium">
                                {apiPolicy.sprtTrgtAgeLmtYn === "Y"
                                    ? `만 ${apiPolicy.sprtTrgtMinAge || 19}세 ~ 만 ${apiPolicy.sprtTrgtMaxAge || 34}세`
                                    : "연령 제한 없음"}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-2">소득 조건</div>
                            <div className="font-medium whitespace-pre-wrap">
                                {apiPolicy.earnEtcCn || " 소득 제한 없음"}
                            </div>
                        </div>
                    </div>
                    {apiPolicy.addAplyQlfcCndCn && (
                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <div className="text-sm font-semibold text-blue-800 mb-2">추가 자격 조건</div>
                            <div className="text-blue-900 whitespace-pre-wrap">{apiPolicy.addAplyQlfcCndCn}</div>
                        </div>
                    )}
                    {apiPolicy.ptcpPrpTrgtCn && (
                        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                            <div className="text-sm font-semibold text-red-800 mb-2">참여 제한</div>
                            <div className="text-red-900 whitespace-pre-wrap">{apiPolicy.ptcpPrpTrgtCn}</div>
                        </div>
                    )}
                </section>

                {apiPolicy.plcyAplyMthdCn && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>📝</span> 신청 방법
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.plcyAplyMthdCn}
                        </div>
                    </section>
                )}

                {apiPolicy.sbmsnDcmntCn && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>📋</span> 제출 서류
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.sbmsnDcmntCn}
                        </div>
                    </section>
                )}

                {apiPolicy.srngMthdCn && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>🔍</span> 심사 방법
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.srngMthdCn}
                        </div>
                    </section>
                )}

                {apiPolicy.etcMttrCn && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <span>ℹ️</span> 참고 사항
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-5 text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {apiPolicy.etcMttrCn}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <span>📅</span> 사업 기간
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">시작</div>
                                <div className="font-medium">{formatYmd(apiPolicy.bizPrdBgngYmd)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">종료</div>
                                <div className="font-medium">{formatYmd(apiPolicy.bizPrdEndYmd)}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-wrap gap-4 pt-4">
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
                            온통청년에서 확인하기
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </section>

                {(apiPolicy.refUrlAddr1 || apiPolicy.refUrlAddr2) && (
                    <section className="border-t border-gray-200 pt-6">
                        <h3 className="font-semibold mb-3">참고 링크</h3>
                        <ul className="space-y-2">
                            {apiPolicy.refUrlAddr1 && (
                                <li>
                                    <a href={apiPolicy.refUrlAddr1} target="_blank" rel="noopener noreferrer"
                                       className="text-teal-600 hover:underline break-all">
                                        → {new URL(apiPolicy.refUrlAddr1).hostname}
                                    </a>
                                </li>
                            )}
                            {apiPolicy.refUrlAddr2 && (
                                <li>
                                    <a href={apiPolicy.refUrlAddr2} target="_blank" rel="noopener noreferrer"
                                       className="text-teal-600 hover:underline break-all">
                                        → {new URL(apiPolicy.refUrlAddr2).hostname}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </section>
                )}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
                본 정보는 온통청년(youthcenter.go.kr) API를 통해 제공되며, 정확한 내용은 해당 기관에 확인하시기 바랍니다.
            </div>
        </article>
    );
}