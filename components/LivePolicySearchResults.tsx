"use client";

import { useEffect, useMemo, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import type { YouthApiResponse, YouthPolicy } from "@/lib/youthApi";

const PAGE_SIZE = 24;

const API_CATEGORY_TO_SUPPORT_TYPES: Record<string, string[]> = {
    "주거": ["현금 지원", "대출"],
    "일자리": ["교육/훈련", "현금 지원", "시설/공간"],
    "교육": ["교육/훈련"],
    "금융･복지･문화": ["현금 지원", "대출", "기타"],
    "참여권리": ["기타"],
};

function normalizeTitle(value: string): string {
    return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

function inferTargetTypes(policy: YouthPolicy): string[] {
    const source = `${policy.plcyNm} ${policy.plcyExplnCn} ${policy.plcyKywdNm ?? ""}`;
    const targets: string[] = [];

    if (/대학|학생|장학/.test(source)) targets.push("대학생");
    if (/취업준비|취준|구직|미취업/.test(source)) targets.push("취준생");
    if (/직장인|재직|근로자|근로/.test(source)) targets.push("직장인");
    if (/창업|사업자|소상공인/.test(source)) targets.push("창업자");
    if (/무주택|월세|전세|주거/.test(source)) targets.push("무주택자");
    if (/저소득|기초|중위소득/.test(source)) targets.push("저소득층");

    return targets.length > 0 ? targets : ["기타"];
}

interface LivePolicySearchResultsProps {
    query: string;
    categorySlug: string | null;
    regionCode: string;
    selectedTargets: string[];
    selectedSupportTypes: string[];
    guideTitles: string[];
}

export default function LivePolicySearchResults({
    query,
    categorySlug,
    regionCode,
    selectedTargets,
    selectedSupportTypes,
    guideTitles,
}: LivePolicySearchResultsProps) {
    const [policies, setPolicies] = useState<YouthPolicy[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPolicies = async (requestedPage: number, append: boolean, signal?: AbortSignal) => {
        const params = new URLSearchParams({ page: String(requestedPage), size: String(PAGE_SIZE) });
        const normalizedQuery = query.trim();
        if (normalizedQuery) params.set("q", normalizedQuery);
        if (categorySlug) params.set("cat", categorySlug);
        if (regionCode) params.set("region", regionCode);

        const response = await fetch(`/api/policies?${params.toString()}`, { signal });
        if (!response.ok) throw new Error("실시간 정책을 불러오지 못했습니다.");

        const data = (await response.json()) as YouthApiResponse;
        const nextPolicies = data.result?.youthPolicyList ?? [];
        const nextTotal = data.result?.pagging?.totCount ?? nextPolicies.length;

        setPolicies((current) => {
            if (!append) return nextPolicies;
            const merged = new Map(current.map((policy) => [policy.plcyNo, policy]));
            nextPolicies.forEach((policy) => merged.set(policy.plcyNo, policy));
            return [...merged.values()];
        });
        setTotalCount(nextTotal);
        setPage(requestedPage);
    };

    useEffect(() => {
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                await requestPolicies(1, false, controller.signal);
            } catch (requestError) {
                if ((requestError as Error).name !== "AbortError") {
                    setPolicies([]);
                    setTotalCount(0);
                    setError("실시간 정책을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, query.trim() ? 250 : 0);

        return () => {
            controller.abort();
            window.clearTimeout(timer);
        };
        // 검색어·카테고리·지역은 API에서 처리하고, 대상·지원형태는 현재 결과에 즉시 적용합니다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, categorySlug, regionCode]);

    const guideTitleKeys = useMemo(() => new Set(guideTitles.map(normalizeTitle)), [guideTitles]);

    const visiblePolicies = useMemo(() => {
        return policies.filter((policy) => {
            if (guideTitleKeys.has(normalizeTitle(policy.plcyNm))) return false;

            const targetTypes = inferTargetTypes(policy);
            if (selectedTargets.length > 0 && !targetTypes.some((target) => selectedTargets.includes(target))) return false;

            const supportTypes = API_CATEGORY_TO_SUPPORT_TYPES[policy.lclsfNm ?? ""] ?? ["기타"];
            if (selectedSupportTypes.length > 0 && !supportTypes.some((type) => selectedSupportTypes.includes(type))) return false;

            return true;
        });
    }, [guideTitleKeys, policies, selectedSupportTypes, selectedTargets]);

    const canLoadMore = policies.length < totalCount;

    const loadMore = async () => {
        if (loadingMore || !canLoadMore) return;
        setLoadingMore(true);
        setError(null);
        try {
            await requestPolicies(page + 1, true);
        } catch {
            setError("추가 정책을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <section className="border-t border-gray-100 pt-10 dark:border-slate-800" aria-labelledby="live-policy-title">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                        온통청년 연동
                    </div>
                    <h2 id="live-policy-title" className="break-keep text-xl font-black text-gray-900 dark:text-white">실시간 정부 정책</h2>
                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">정부·지자체가 최신 등록한 정책 공고입니다. 핵심 가이드와 제목이 같은 항목은 중복 표시하지 않습니다.</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-gray-500 dark:text-gray-400">
                    {loading ? "불러오는 중" : <><span className="text-sky-600 dark:text-sky-400">{totalCount.toLocaleString()}건</span> 중 {visiblePolicies.length}건 표시</>}
                </p>
            </div>

            {error && (
                <div role="status" className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-64 animate-pulse rounded-2xl border border-gray-150 bg-gray-50 dark:border-slate-800 dark:bg-slate-900" />
                    ))}
                </div>
            ) : visiblePolicies.length > 0 ? (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        {visiblePolicies.map((policy) => <PolicyCard key={policy.plcyNo} policy={policy} />)}
                    </div>
                    {canLoadMore && (
                        <div className="pt-8 text-center">
                            <button type="button" onClick={loadMore} disabled={loadingMore} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60">
                                {loadingMore ? "정책을 불러오는 중..." : "실시간 정책 24개 더 불러오기"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="font-bold text-gray-500 dark:text-gray-400">현재 불러온 정책 중에는 조건에 맞는 항목이 없습니다.</p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">다른 검색어 또는 카테고리로 다시 확인하거나 다음 정책을 더 불러와 보세요.</p>
                    {canLoadMore && (
                        <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60">
                            {loadingMore ? "정책을 불러오는 중..." : "실시간 정책 더 불러오기"}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
