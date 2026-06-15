"use client";

import { useState } from "react";
import { YouthPolicy, YouthApiResponse } from "@/lib/youthApi";
import PolicyCard from "./PolicyCard";

interface SearchPolicyListProps {
    initialPolicies: YouthPolicy[];
    query: string;
    initialTotalCount: number;
}

export default function SearchPolicyList({
    initialPolicies,
    query,
    initialTotalCount,
}: SearchPolicyListProps) {
    const [policies, setPolicies] = useState<YouthPolicy[]>(initialPolicies);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialPolicies.length < initialTotalCount);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/policies?q=${encodeURIComponent(query)}&page=${nextPage}&size=12`);
            if (!res.ok) throw new Error("정책을 불러오는 데 실패했습니다.");

            const data = (await res.json()) as YouthApiResponse;
            const newPolicies = data.result?.youthPolicyList ?? [];

            if (newPolicies.length > 0) {
                setPolicies((prev) => [...prev, ...newPolicies]);
                setPage(nextPage);
                setHasMore(policies.length + newPolicies.length < initialTotalCount);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-6">
                {policies.map((p) => (
                    <PolicyCard key={p.plcyNo} policy={p} />
                ))}

                {/* 로딩 스켈레톤 카드 */}
                {loading &&
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 h-[230px] flex flex-col justify-between animate-pulse"
                        >
                            <div>
                                <div className="h-4.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-3.5"></div>
                                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto"></div>
                        </div>
                    ))}
            </div>

            {/* 더 보기 버튼 */}
            {hasMore && !loading && (
                <div className="text-center pt-4">
                    <button
                        onClick={loadMore}
                        className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl hover:shadow-[0_8px_25px_rgba(13,148,136,0.25)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                        더 많은 정책 보기 ⤓
                    </button>
                </div>
            )}
        </div>
    );
}
