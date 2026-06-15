"use client";

import { useState } from "react";
import { YouthPolicy, YouthApiResponse } from "@/lib/youthApi";
import PolicyCard from "./PolicyCard";

interface SearchPolicyListProps {
    initialPolicies: YouthPolicy[];
    query: string;
    region: string;
    age?: number;
    initialTotalCount: number;
}

export default function SearchPolicyList({
    initialPolicies,
    query,
    region,
    age,
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
            const regionParam = region ? `&region=${region}` : "";
            const res = await fetch(`/api/policies?q=${encodeURIComponent(query)}${regionParam}&page=${nextPage}&size=24`);
            if (!res.ok) throw new Error("정책을 불러오는 데 실패했습니다.");

            const data = (await res.json()) as YouthApiResponse;
            let newPolicies = data.result?.youthPolicyList ?? [];

            // 나이 조건 필터링
            if (age !== undefined) {
                newPolicies = newPolicies.filter(p => {
                    const minAge = p.sprtTrgtMinAge ? Number(p.sprtTrgtMinAge) : 0;
                    const maxAge = p.sprtTrgtMaxAge ? Number(p.sprtTrgtMaxAge) : 99;
                    if (p.sprtTrgtAgeLmtYn === "Y") {
                        return age >= minAge && age <= maxAge;
                    }
                    return true;
                });
            }

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
                <div className="text-center pt-8">
                    <button
                        onClick={loadMore}
                        className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
                    >
                        더 많은 정책 불러오기 ⤓
                    </button>
                </div>
            )}
        </div>
    );
}
