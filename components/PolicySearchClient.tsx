"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";

export type SearchPolicy = {
    id: string;
    title: string;
    description: string;
    category: string;
    categorySlug: string;
    date: string;
    tags: string[];
};

type CategoryPresentation = {
    label: string;
    icon: string;
    categoryColor: string;
    iconBg: string;
    supportTypes: string[];
};

const CATEGORY_PRESENTATION: Record<string, CategoryPresentation> = {
    housing: {
        label: "주거",
        icon: "🏠",
        categoryColor: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
        iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        supportTypes: ["현금 지원", "대출"],
    },
    job: {
        label: "일자리",
        icon: "💼",
        categoryColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30",
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        supportTypes: ["교육/훈련", "현금 지원"],
    },
    edu: {
        label: "교육/문화",
        icon: "📚",
        categoryColor: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30",
        iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
        supportTypes: ["교육/훈련"],
    },
    startup: {
        label: "창업",
        icon: "🚀",
        categoryColor: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        supportTypes: ["현금 지원", "시설/공간"],
    },
    finance: {
        label: "금융/자산",
        icon: "💰",
        categoryColor: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30",
        iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
        supportTypes: ["현금 지원", "대출"],
    },
    transport: {
        label: "교통",
        icon: "🚇",
        categoryColor: "text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30",
        iconBg: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
        supportTypes: ["기타"],
    },
    life: {
        label: "건강/생활",
        icon: "🌿",
        categoryColor: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30",
        iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
        supportTypes: ["기타"],
    },
};

const DEFAULT_PRESENTATION: CategoryPresentation = {
    label: "기타",
    icon: "📌",
    categoryColor: "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900 border-slate-100 dark:border-slate-800",
    iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    supportTypes: ["기타"],
};

const REGIONS = ["전체 지역", "전국", "서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산"];
const TARGETS = ["대학생", "취준생", "직장인", "창업자", "무주택자", "저소득층", "기타"];
const SUPPORT_TYPES = ["현금 지원", "교육/훈련", "대출", "시설/공간", "기타"];

function getPresentation(categorySlug: string): CategoryPresentation {
    return CATEGORY_PRESENTATION[categorySlug] ?? DEFAULT_PRESENTATION;
}

function inferTargetTypes(policy: SearchPolicy): string[] {
    const source = `${policy.title} ${policy.description} ${policy.tags.join(" ")}`;
    const targets: string[] = [];

    if (/대학|학생|장학/.test(source)) targets.push("대학생");
    if (/취업준비|취준|구직|미취업/.test(source)) targets.push("취준생");
    if (/직장인|재직|근로자|근로/.test(source)) targets.push("직장인");
    if (/창업|사업자|소상공인/.test(source)) targets.push("창업자");
    if (/무주택|월세|전세|주거/.test(source)) targets.push("무주택자");
    if (/저소득|기초|중위소득/.test(source)) targets.push("저소득층");

    return targets.length > 0 ? targets : ["기타"];
}

function policyMatchesRegion(region: string): boolean {
    // 콘텐츠 가이드는 전국 기준 정책 정보이므로, 지역을 지정해도 전국 공통 가이드는 함께 표시합니다.
    return region === "전체 지역" || region === "전국" || REGIONS.includes(region);
}

interface PolicySearchClientProps {
    initialPolicies: SearchPolicy[];
}

export default function PolicySearchClient({ initialPolicies }: PolicySearchClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState("전체 지역");
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [selectedSupportTypes, setSelectedSupportTypes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"latest" | "title">("latest");

    useEffect(() => {
        const query = searchParams.get("q") ?? "";
        const category = searchParams.get("cat");
        setSearchQuery(query);
        setSelectedCategory(category && CATEGORY_PRESENTATION[category] ? category : null);
    }, [searchParams]);

    const filteredPolicies = useMemo(() => {
        return initialPolicies
            .filter((policy) => {
                const query = searchQuery.trim().toLowerCase();
                const searchableText = `${policy.title} ${policy.description} ${policy.category} ${policy.tags.join(" ")}`.toLowerCase();
                if (query && !searchableText.includes(query)) return false;
                if (selectedCategory && policy.categorySlug !== selectedCategory) return false;
                if (!policyMatchesRegion(selectedRegion)) return false;

                const targetTypes = inferTargetTypes(policy);
                if (selectedTargets.length > 0 && !targetTypes.some((target) => selectedTargets.includes(target))) return false;

                const supportTypes = getPresentation(policy.categorySlug).supportTypes;
                if (selectedSupportTypes.length > 0 && !supportTypes.some((type) => selectedSupportTypes.includes(type))) return false;

                return true;
            })
            .sort((a, b) => (sortBy === "latest" ? b.date.localeCompare(a.date) : a.title.localeCompare(b.title, "ko")));
    }, [initialPolicies, searchQuery, selectedCategory, selectedRegion, selectedTargets, selectedSupportTypes, sortBy]);

    const categoryCounts = useMemo(() => {
        return Object.fromEntries(
            Object.keys(CATEGORY_PRESENTATION).map((slug) => [slug, initialPolicies.filter((policy) => policy.categorySlug === slug).length])
        ) as Record<string, number>;
    }, [initialPolicies]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSelectedRegion("전체 지역");
        setSelectedTargets([]);
        setSelectedSupportTypes([]);
        router.push("/search");
    };

    const toggleTarget = (target: string) => {
        setSelectedTargets((current) => (current.includes(target) ? current.filter((item) => item !== target) : [...current, target]));
    };

    const toggleSupportType = (type: string) => {
        setSelectedSupportTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <aside className="space-y-6 rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
                        <div>
                            <h1 className="text-lg font-black text-gray-900 dark:text-white">정책 검색</h1>
                            <p className="mt-1 text-xs font-medium text-gray-400">검증된 가이드 {initialPolicies.length}개</p>
                        </div>
                        <button type="button" onClick={resetFilters} className="rounded-lg px-2 py-1 text-xs font-bold text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400">
                            초기화
                        </button>
                    </div>

                    <section className="space-y-3" aria-labelledby="policy-category-filter">
                        <h2 id="policy-category-filter" className="text-sm font-black text-gray-900 dark:text-white">카테고리</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(CATEGORY_PRESENTATION).map(([slug, presentation]) => {
                                const selected = selectedCategory === slug;
                                return (
                                    <button
                                        type="button"
                                        key={slug}
                                        onClick={() => setSelectedCategory((current) => (current === slug ? null : slug))}
                                        className={`flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-all ${selected ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"}`}
                                    >
                                        <span aria-hidden="true">{presentation.icon}</span>
                                        <span className="truncate">{presentation.label}</span>
                                        <span className="text-[10px] opacity-75">{categoryCounts[slug]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="space-y-3" aria-labelledby="policy-region-filter">
                        <h2 id="policy-region-filter" className="text-sm font-black text-gray-900 dark:text-white">지역</h2>
                        <div className="relative">
                            <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)} className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
                                {REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
                            </select>
                            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                        </div>
                        <p className="text-[11px] leading-4 text-gray-400 dark:text-gray-500">전국 공통 가이드를 우선 제공하며, 지역별 공고는 상세 페이지에서 확인할 수 있습니다.</p>
                    </section>

                    <FilterChecklist title="대상" options={TARGETS} selected={selectedTargets} onToggle={toggleTarget} />
                    <FilterChecklist title="지원 형태" options={SUPPORT_TYPES} selected={selectedSupportTypes} onToggle={toggleSupportType} />
                </aside>

                <main className="min-w-0 space-y-6 lg:col-span-9">
                    <form onSubmit={(event) => event.preventDefault()} className="flex min-w-0 rounded-2xl border border-gray-150 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <label htmlFor="policy-search-query" className="sr-only">정책 검색어</label>
                        <input id="policy-search-query" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="정책명, 지원 내용, 대상 키워드를 입력하세요" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100" />
                        <button type="submit" className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 active:scale-[0.98]">검색</button>
                    </form>

                    <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400"><span className="text-blue-600 dark:text-blue-400">{filteredPolicies.length}개</span> 정책 가이드</p>
                        <label className="flex items-center gap-2 self-start text-xs font-semibold text-gray-400 sm:self-auto">
                            정렬
                            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "latest" | "title")} className="rounded-lg border border-gray-200 bg-transparent px-2.5 py-1.5 text-xs font-bold text-gray-700 outline-none dark:border-slate-800 dark:text-gray-300">
                                <option value="latest">최신순</option>
                                <option value="title">가나다순</option>
                            </select>
                        </label>
                    </div>

                    {filteredPolicies.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {filteredPolicies.map((policy) => <SearchResultCard key={policy.id} policy={policy} />)}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-16 text-center dark:border-slate-800 dark:bg-slate-900/40">
                            <p className="font-bold text-gray-500 dark:text-gray-400">조건에 맞는 정책 가이드가 없습니다.</p>
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">검색어를 바꾸거나 필터를 완화해 보세요.</p>
                            <button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50 dark:bg-slate-800 dark:ring-slate-700">필터 초기화</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function FilterChecklist({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (option: string) => void }) {
    return (
        <section className="space-y-3" aria-label={title}>
            <h2 className="text-sm font-black text-gray-900 dark:text-white">{title}</h2>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option} className="flex min-h-6 cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </section>
    );
}

function SearchResultCard({ policy }: { policy: SearchPolicy }) {
    const presentation = getPresentation(policy.categorySlug);

    return (
        <article className="group relative flex min-w-0 flex-col rounded-2xl border border-gray-150 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
            <div className="absolute right-4 top-4 z-10">
                <BookmarkButton policy={{ id: policy.id, type: "markdown", title: policy.title, description: policy.description, categorySlug: policy.categorySlug, categoryName: policy.category, aplyYmd: policy.date }} variant="icon" />
            </div>
            <Link href={`/policy/${policy.id}`} className="flex min-w-0 flex-1 flex-col">
                <div className="flex min-w-0 items-center gap-3 pr-10">
                    <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${presentation.iconBg}`}>{presentation.icon}</span>
                    <div className="min-w-0">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-black ${presentation.categoryColor}`}>{policy.category}</span>
                        <h2 className="mt-2 break-keep text-base font-extrabold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{policy.title}</h2>
                    </div>
                </div>
                <p className="mt-4 line-clamp-3 break-keep text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">{policy.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {policy.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-400 dark:bg-slate-800/60 dark:text-gray-500">#{tag}</span>)}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-400 dark:border-slate-800 dark:text-gray-500">
                    <span>가이드 업데이트</span>
                    <time dateTime={policy.date}>{policy.date}</time>
                </div>
            </Link>
        </article>
    );
}
