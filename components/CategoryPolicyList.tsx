"use client";

import { useState } from "react";
import { YouthPolicy, YouthApiResponse } from "@/lib/youthApi";
import PolicyCard from "./PolicyCard";

const REGIONS = [
    { name: "전체", code: "" },
    { name: "서울", code: "003002001" },
    { name: "경기", code: "003002009" },
    { name: "인천", code: "003002004" },
    { name: "부산", code: "003002002" },
    { name: "대구", code: "003002003" },
    { name: "광주", code: "003002005" },
    { name: "대전", code: "003002006" },
    { name: "울산", code: "003002007" },
    { name: "세종", code: "003002008" },
    { name: "강원", code: "003002010" },
    { name: "충북", code: "003002011" },
    { name: "충남", code: "003002012" },
    { name: "전북", code: "003002013" },
    { name: "전남", code: "003002014" },
    { name: "경북", code: "003002015" },
    { name: "경남", code: "003002016" },
    { name: "제주", code: "003002017" },
];

interface CategoryPolicyListProps {
    initialPolicies: YouthPolicy[];
    categorySlug: string;
    initialTotalCount: number;
    isRegion?: boolean;
}

export default function CategoryPolicyList({
    initialPolicies,
    categorySlug,
    initialTotalCount,
    isRegion = false,
}: CategoryPolicyListProps) {
    const [policies, setPolicies] = useState<YouthPolicy[]>(initialPolicies);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialPolicies.length < initialTotalCount);
    const [selectedRegion, setSelectedRegion] = useState("");

    const fetchPolicies = async (regionCode: string, pageNum: number, append: boolean) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ category: categorySlug, page: String(pageNum), size: "24" });
            if (regionCode) params.set("region", regionCode);
            const res = await fetch(`/api/policies?${params.toString()}`);
            if (!res.ok) throw new Error("정책을 불러오는 데 실패했습니다.");
            const data = (await res.json()) as YouthApiResponse;
            const newPolicies = data.result?.youthPolicyList ?? [];
            const tot = data.result?.pagging?.totCount ?? newPolicies.length;
            if (append) {
                setPolicies((prev) => {
                    const updated = [...prev, ...newPolicies];
                    setHasMore(updated.length < tot);
                    return updated;
                });
            } else {
                setPolicies(newPolicies);
                setHasMore(newPolicies.length < tot);
            }
            setPage(pageNum);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegionChange = (code: string) => {
        if (code === selectedRegion) return;
        setSelectedRegion(code);
        fetchPolicies(code, 1, false);
    };

    const loadMore = async () => {
        if (loading) return;
        fetchPolicies(selectedRegion, page + 1, true);
    };

    return (
        <div className="space-y-10">
            {isRegion && (
                <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                        <button
                            key={r.code}
                            type="button"
                            onClick={() => handleRegionChange(r.code)}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                selectedRegion === r.code
                                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-teal-400 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400"
                            }`}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((p) => (
                    <PolicyCard key={p.plcyNo} policy={p} />
                ))}
                
                {/* 로딩 스켈레톤 카드 */}
                {loading &&
                    Array.from({ length: 6 }).map((_, idx) => (
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
            {!loading && policies.length === 0 && (
                <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-3xl p-16 text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">해당 지역의 정책이 없습니다.</p>
                </div>
            )}
        </div>
    );
}
