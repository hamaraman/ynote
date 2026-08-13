"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";

// Mock policies matching the design exactly + extra categories
interface PolicyItem {
    id: string;
    title: string;
    category: "주거" | "교육" | "취업" | "창업" | "금융" | "생활" | "문화";
    categoryColor: string;
    iconBg: string;
    icon: string;
    description: string;
    targetTags: string[];
    region: string;
    deadline: string;
    dday: number | string; // e.g. 12 for D-12, "상시" for 상시신청
    isAvailable: boolean;
    isRecommended: boolean;
    targetTypes: string[]; // 대학생, 취준생, 무주택자 등
    supportTypes: string[]; // 현금 지원, 교육/훈련, 대출 등
}

const ALL_MOCK_POLICIES: PolicyItem[] = [
    {
        id: "youth-rent-support",
        title: "청년 월세 한시 특별지원",
        category: "주거",
        categoryColor: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
        iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        icon: "🏠",
        description: "월 최대 20만원씩 최대 12개월 지원",
        targetTags: ["만 19~34세", "무주택", "소득기준"],
        region: "전국",
        deadline: "2024.06.30",
        dday: 12,
        isAvailable: true,
        isRecommended: true,
        targetTypes: ["무주택자", "저소득층"],
        supportTypes: ["현금 지원"]
    },
    {
        id: "youth-work-experience",
        title: "청년 일경험 지원사업",
        category: "취업",
        categoryColor: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30",
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        icon: "💼",
        description: "월 최대 234만원 지원",
        targetTags: ["만 15~34세", "미취업 청년", "경력형성"],
        region: "전국",
        deadline: "2024.06.21",
        dday: 3,
        isAvailable: true,
        isRecommended: true,
        targetTypes: ["취준생", "대학생"],
        supportTypes: ["교육/훈련", "현금 지원"]
    },
    {
        id: "learning-card",
        title: "국민내일배움카드",
        category: "교육",
        categoryColor: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30",
        iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
        icon: "💳",
        description: "최대 500만원 지원",
        targetTags: ["취업준비생", "직장인", "직무교육"],
        region: "전국",
        deadline: "상시신청",
        dday: "상시",
        isAvailable: true,
        isRecommended: false,
        targetTypes: ["취준생", "직장인", "기타"],
        supportTypes: ["교육/훈련"]
    },
    {
        id: "pre-startup-package",
        title: "청년 창업 지원사업",
        category: "창업",
        categoryColor: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        icon: "🚀",
        description: "최대 1억원 지원",
        targetTags: ["예비창업자", "3년이내", "사업화"],
        region: "전국",
        deadline: "2024.07.05",
        dday: 18,
        isAvailable: true,
        isRecommended: true,
        targetTypes: ["창업자", "기타"],
        supportTypes: ["현금 지원", "시설/공간"]
    },
    {
        id: "youth-leap-account",
        title: "청년도약계좌",
        category: "금융",
        categoryColor: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30",
        iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
        icon: "💰",
        description: "매월 70만원 한도 내 저축 시 비과세 및 정부 기여금 지원",
        targetTags: ["만 19~34세", "자산형성", "목돈마련"],
        region: "전국",
        deadline: "2024.12.31",
        dday: 140,
        isAvailable: true,
        isRecommended: true,
        targetTypes: ["대학생", "취준생", "직장인", "창업자"],
        supportTypes: ["대출", "기타"]
    },
    {
        id: "youth-mental-health",
        title: "청년 마음건강 지원사업",
        category: "생활",
        categoryColor: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/30",
        iconBg: "bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
        icon: "💖",
        description: "청년의 심리 정서 지원 및 전문 상담 서비스 제공",
        targetTags: ["만 19~34세", "심리상담", "마음건강"],
        region: "서울",
        deadline: "2024.09.30",
        dday: 48,
        isAvailable: true,
        isRecommended: false,
        targetTypes: ["기타"],
        supportTypes: ["교육/훈련", "기타"]
    },
    {
        id: "culture-pass",
        title: "청년 문화예술패스",
        category: "문화",
        categoryColor: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30",
        iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
        icon: "🎭",
        description: "만 19세 청년 대상 공연 및 전시 관람비 최대 15만원 지원",
        targetTags: ["만 19세", "공연관람", "문화지원"],
        region: "전국",
        deadline: "2024.08.31",
        dday: 18,
        isAvailable: false,
        isRecommended: false,
        targetTypes: ["대학생", "기타"],
        supportTypes: ["현금 지원", "기타"]
    }
];

const CATEGORIES = [
    { label: "주거", icon: "🏠", slug: "주거" },
    { label: "교육", icon: "📚", slug: "교육" },
    { label: "취업", icon: "💼", slug: "취업" },
    { label: "창업", icon: "🚀", slug: "창업" },
    { label: "금융", icon: "🪙", slug: "금융" },
    { label: "생활", icon: "🏥", slug: "생활" },
    { label: "문화", icon: "🎭", slug: "문화" }
];

const REGIONS = ["전체 지역", "전국", "서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산"];
const TARGETS = ["대학생", "취준생", "직장인", "창업자", "무주택자", "저소득층", "기타"];
const SUPPORT_TYPES = ["현금 지원", "교육/훈련", "대출", "시설/공간", "기타"];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState("전체 지역");
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [selectedSupportTypes, setSelectedSupportTypes] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<"all" | "available" | "closing" | "recommended">("all");
    const [sortBy, setSortBy] = useState<"latest" | "deadline">("latest");

    // Initialize category if set from outer navigation
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setSearchQuery(q);

        const filter = searchParams.get("filter");
        if (filter === "closing") {
            setActiveTab("closing");
        }
    }, [searchParams]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    const handleTargetCheckboxChange = (target: string) => {
        setSelectedTargets(prev =>
            prev.includes(target) ? prev.filter(t => t !== target) : [...prev, target]
        );
    };

    const handleSupportCheckboxChange = (type: string) => {
        setSelectedSupportTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSelectedRegion("전체 지역");
        setSelectedTargets([]);
        setSelectedSupportTypes([]);
        setActiveTab("all");
        router.push("/search");
    };

    const filteredPolicies = useMemo(() => {
        return ALL_MOCK_POLICIES.filter((p) => {
            // 1. Search text
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = p.title.toLowerCase().includes(searchLower);
                const matchesDesc = p.description.toLowerCase().includes(searchLower);
                const matchesTags = p.targetTags.some(t => t.toLowerCase().includes(searchLower));
                if (!matchesTitle && !matchesDesc && !matchesTags) return false;
            }

            // 2. Category
            if (selectedCategory && p.category !== selectedCategory) return false;

            // 3. Region
            if (selectedRegion !== "전체 지역") {
                if (p.region !== selectedRegion && p.region !== "전국") return false;
            }

            // 4. Targets
            if (selectedTargets.length > 0) {
                const hasMatchingTarget = p.targetTypes.some(t => selectedTargets.includes(t));
                if (!hasMatchingTarget) return false;
            }

            // 5. Support Types
            if (selectedSupportTypes.length > 0) {
                const hasMatchingSupport = p.supportTypes.some(s => selectedSupportTypes.includes(s));
                if (!hasMatchingSupport) return false;
            }

            // 6. Tabs
            if (activeTab === "available" && !p.isAvailable) return false;
            if (activeTab === "closing") {
                if (typeof p.dday !== "number" || p.dday > 30) return false;
            }
            if (activeTab === "recommended" && !p.isRecommended) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === "deadline") {
                if (a.dday === "상시") return 1;
                if (b.dday === "상시") return -1;
                return (a.dday as number) - (b.dday as number);
            } else {
                // mock sorting by latest
                return a.title.localeCompare(b.title);
            }
        });
    }, [searchQuery, selectedCategory, selectedRegion, selectedTargets, selectedSupportTypes, activeTab, sortBy]);

    // Counts for tabs
    const counts = useMemo(() => {
        const baseFiltered = ALL_MOCK_POLICIES.filter((p) => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesTitle = p.title.toLowerCase().includes(searchLower);
                const matchesDesc = p.description.toLowerCase().includes(searchLower);
                const matchesTags = p.targetTags.some(t => t.toLowerCase().includes(searchLower));
                if (!matchesTitle && !matchesDesc && !matchesTags) return false;
            }
            if (selectedCategory && p.category !== selectedCategory) return false;
            if (selectedRegion !== "전체 지역") {
                if (p.region !== selectedRegion && p.region !== "전국") return false;
            }
            if (selectedTargets.length > 0) {
                const hasMatchingTarget = p.targetTypes.some(t => selectedTargets.includes(t));
                if (!hasMatchingTarget) return false;
            }
            if (selectedSupportTypes.length > 0) {
                const hasMatchingSupport = p.supportTypes.some(s => selectedSupportTypes.includes(s));
                if (!hasMatchingSupport) return false;
            }
            return true;
        });

        return {
            all: baseFiltered.length,
            available: baseFiltered.filter(p => p.isAvailable).length,
            closing: baseFiltered.filter(p => typeof p.dday === "number" && p.dday <= 30).length,
            recommended: baseFiltered.filter(p => p.isRecommended).length,
        };
    }, [searchQuery, selectedCategory, selectedRegion, selectedTargets, selectedSupportTypes]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Filter Sidebar */}
                <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white">검색 필터</h2>
                        <button
                            onClick={handleResetFilters}
                            className="text-xs font-bold text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                            초기화
                        </button>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">카테고리</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map((c) => {
                                const isSelected = selectedCategory === c.slug;
                                return (
                                    <button
                                        key={c.slug}
                                        onClick={() => handleCategoryClick(c.slug)}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                                            isSelected
                                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                                : "bg-white dark:bg-slate-800 hover:bg-gray-50 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        <span>{c.icon}</span>
                                        <span>{c.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Region Select */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">지역</h3>
                        <div className="relative">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                            >
                                {REGIONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>

                    {/* Target Group Checklist */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">대상</h3>
                        <div className="space-y-2">
                            {TARGETS.map((target) => (
                                <label key={target} className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedTargets.includes(target)}
                                        onChange={() => handleTargetCheckboxChange(target)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{target}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Support Form Checklist */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">지원 형태</h3>
                        <div className="space-y-2">
                            {SUPPORT_TYPES.map((type) => (
                                <label key={type} className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedSupportTypes.includes(type)}
                                        onChange={() => handleSupportCheckboxChange(type)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right Side: Search Result List */}
                <main className="lg:col-span-9 space-y-6">
                    {/* Top Search Bar */}
                    <div className="flex bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="정책이름 입력하세요 (예: 월세, 취업, 창업)"
                            className="flex-1 px-4 py-3 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-sm font-semibold"
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/25 active:scale-95 font-bold text-sm cursor-pointer flex items-center justify-center"
                        >
                            검색
                        </button>
                    </div>

                    {/* Filter Tabs & Sort Dropdown */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-850 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: "all", label: "전체", count: counts.all },
                                { id: "available", label: "신청가능", count: counts.available },
                                { id: "closing", label: "마감임박", count: counts.closing },
                                { id: "recommended", label: "맞춤추천", count: counts.recommended }
                            ].map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer inline-flex items-center justify-center ${
                                            isActive
                                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent"
                                        }`}
                                    >
                                        {tab.label} <span className="text-[10px] font-bold opacity-80">{tab.count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="text-xs font-semibold text-gray-400">정렬</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                            >
                                <option value="latest">최신순</option>
                                <option value="deadline">마감순</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-xs font-bold text-gray-400">
                        검색 결과 총 {filteredPolicies.length}건
                    </div>

                    {/* Policy List Grid */}
                    {filteredPolicies.length > 0 ? (
                        <div className="space-y-4">
                            {filteredPolicies.map((p) => (
                                <div
                                    key={p.id}
                                    className="group relative bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Action button: Bookmark */}
                                    <div className="absolute top-5 right-5 z-10">
                                        <BookmarkButton
                                            policy={{
                                                id: p.id,
                                                type: "markdown",
                                                title: p.title,
                                                description: p.description,
                                                categorySlug: p.category === "주거" ? "housing" : p.category === "취업" ? "job" : p.category === "교육" ? "edu" : p.category === "창업" ? "startup" : p.category === "금융" ? "finance" : p.category === "생활" ? "life" : "region",
                                                categoryName: p.category,
                                                aplyYmd: p.deadline
                                            }}
                                            variant="icon"
                                        />
                                    </div>

                                    <Link href={`/policy/${p.id}`} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        {/* Icon Container */}
                                        <div className={`w-12 h-12 rounded-full ${p.iconBg} flex items-center justify-center text-xl flex-shrink-0 shadow-sm`}>
                                            {p.icon}
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 space-y-2 pr-10">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${p.categoryColor}`}>
                                                    {p.category}
                                                </span>
                                                <span className="text-[10px] font-semibold text-gray-400">
                                                    {p.region} &gt;
                                                </span>
                                            </div>

                                            <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                                {p.title}
                                            </h3>

                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {p.description}
                                            </p>

                                            {/* Target Tag list */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {p.targetTags.map((tag) => (
                                                    <span key={tag} className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/40 px-2 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date and D-Day info */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-36 gap-2 flex-shrink-0 text-right">
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                                                {p.deadline === "상시신청" ? "상시신청" : `~ ${p.deadline}`}
                                            </span>
                                            <span className={`text-xs font-black px-2.5 py-0.5 rounded ${
                                                p.dday === "상시"
                                                    ? "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                                                    : (p.dday as number) <= 7
                                                    ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                                                    : (p.dday as number) <= 14
                                                    ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400"
                                                    : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                                            }`}>
                                                {p.dday === "상시" ? "상시" : `D-${p.dday}`}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-slate-900/40 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-16 text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold">
                                조건에 부합하는 정책이 없습니다.
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                다른 키워드를 입력하거나 필터 옵션을 완화해 보세요.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">
                로딩 중...
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
