"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

const CATEGORIES = [
    { label: "전체", value: "", icon: "" },
    { label: "금융/자산", value: "finance", icon: "💰" },
    { label: "주거", value: "housing", icon: "🏠" },
    { label: "일자리", value: "job", icon: "💼" },
    { label: "교육/문화", value: "edu", icon: "📚" },
    { label: "건강/생활", value: "life", icon: "🏥" },
    { label: "지역별", value: "region", icon: "📍" },
];

const REGIONS = [
    { name: "전국/중앙부처", code: "003002018" },
    { name: "서울특별시", code: "003002001" },
    { name: "경기도", code: "003002009" },
    { name: "부산광역시", code: "003002002" },
    { name: "대구광역시", code: "003002003" },
    { name: "인천광역시", code: "003002004" },
    { name: "광주광역시", code: "003002005" },
    { name: "대전광역시", code: "003002006" },
    { name: "울산광역시", code: "003002007" },
    { name: "세종특별자치시", code: "003002008" },
    { name: "강원특별자치도", code: "003002010" },
    { name: "충청북도", code: "003002011" },
    { name: "충청남도", code: "003002012" },
    { name: "전북특별자치도", code: "003002013" },
    { name: "전라남도", code: "003002014" },
    { name: "경상북도", code: "003002015" },
    { name: "경상남도", code: "003002016" },
    { name: "제주특별자치도", code: "003002017" },
];

interface Props {
    defaultQ?: string;
    defaultAge?: string;
    defaultRegion?: string;
    defaultCat?: string;
}

type FilterKey = "q" | "age" | "region" | "cat";

export default function SearchFilters({
    defaultQ = "",
    defaultAge = "",
    defaultRegion = "",
    defaultCat = "",
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [q, setQ] = useState(defaultQ);
    const [age, setAge] = useState(defaultAge);
    const [region, setRegion] = useState(defaultRegion);
    const [cat, setCat] = useState(defaultCat);
    const [loadedFromStorage, setLoadedFromStorage] = useState(false);

    // URL 파라미터가 없는 첫 방문일 때만 이전 조건(localStorage) 불러오기.
    // 편집 가능한 폼 상태를 클라이언트 전용 값으로 마운트 후 1회 초기화하는 경우라
    // useSyncExternalStore(읽기 전용)로는 대체할 수 없고, lazy 초기화는 안내 배너
    // 서브트리에서 하이드레이션 불일치를 일으킨다. → effect-setState가 올바른 패턴.
    useEffect(() => {
        const hasUrlParams = !!(defaultQ || defaultAge || defaultRegion || defaultCat);
        if (!hasUrlParams) {
            const savedAge = localStorage.getItem("ynote_age") || "";
            const savedRegion = localStorage.getItem("ynote_region") || "";
            if (savedAge || savedRegion) {
                /* eslint-disable react-hooks/set-state-in-effect */
                if (savedAge) setAge(savedAge);
                if (savedRegion) setRegion(savedRegion);
                setLoadedFromStorage(true);
                /* eslint-enable react-hooks/set-state-in-effect */
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function buildUrl(overrides: Partial<Record<FilterKey, string>> = {}) {
        const vals: Record<FilterKey, string> = { q, age, region, cat, ...overrides };
        const params = new URLSearchParams();
        if (vals.q) params.set("q", vals.q);
        if (vals.age) params.set("age", vals.age);
        if (vals.region) params.set("region", vals.region);
        if (vals.cat) params.set("cat", vals.cat);
        const qs = params.toString();
        return `/search${qs ? `?${qs}` : ""}`;
    }

    function navigate(overrides?: Partial<Record<FilterKey, string>>) {
        startTransition(() => router.push(buildUrl(overrides)));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 나이·지역 조건을 localStorage에 저장
        if (age) localStorage.setItem("ynote_age", age);
        else localStorage.removeItem("ynote_age");
        if (region) localStorage.setItem("ynote_region", region);
        else localStorage.removeItem("ynote_region");
        setLoadedFromStorage(false);
        navigate();
    };

    const handleCategoryClick = (value: string) => {
        setCat(value);
        navigate({ cat: value });
    };

    const removeFilter = (key: FilterKey) => {
        if (key === "q") setQ("");
        else if (key === "age") setAge("");
        else if (key === "region") setRegion("");
        else if (key === "cat") setCat("");
        navigate({ [key]: "" });
    };

    const handleReset = () => {
        setQ(""); setAge(""); setRegion(""); setCat("");
        setLoadedFromStorage(false);
        localStorage.removeItem("ynote_age");
        localStorage.removeItem("ynote_region");
        startTransition(() => router.push("/search"));
    };

    const hasFilters = q || age || region || cat;

    const activeChips = (
        [
            cat ? { key: "cat" as FilterKey, label: CATEGORIES.find((c) => c.value === cat)?.label ?? cat } : null,
            region ? { key: "region" as FilterKey, label: REGIONS.find((r) => r.code === region)?.name ?? region } : null,
            age ? { key: "age" as FilterKey, label: `만 ${age}세` } : null,
            q ? { key: "q" as FilterKey, label: `"${q}"` } : null,
        ] as Array<{ key: FilterKey; label: string } | null>
    ).filter((c): c is { key: FilterKey; label: string } => c !== null);

    return (
        <div className="space-y-5 mb-10">
            {/* 카테고리 탭 */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                    const isActive = cat === c.value;
                    return (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => handleCategoryClick(c.value)}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                isActive
                                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-teal-400 dark:hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400"
                            }`}
                        >
                            {c.icon ? `${c.icon} ${c.label}` : c.label}
                        </button>
                    );
                })}
            </div>

            {/* 이전 조건 불러옴 안내 */}
            {loadedFromStorage && (
                <div className="flex items-center gap-2.5 text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-2xl px-4 py-3">
                    <span className="text-base">💾</span>
                    <span>
                        이전에 저장한 조건 {age && `(만 ${age}세`}{age && region && ", "}{region && REGIONS.find(r => r.code === region)?.name}{age || region ? ")" : ""}을 불러왔습니다.
                        {" "}검색 버튼을 눌러 적용하세요.
                    </span>
                    <button
                        type="button"
                        onClick={() => setLoadedFromStorage(false)}
                        className="ml-auto text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* 필터 폼 */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 검색어 */}
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            검색어
                        </label>
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="예: 청년, 월세, 대출"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                        />
                    </div>

                    {/* 지역 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            거주 지역
                        </label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm cursor-pointer appearance-none transition-all"
                        >
                            <option value="">전체 지역</option>
                            {REGIONS.map((r) => (
                                <option key={r.code} value={r.code}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 나이 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            만 나이 (숫자만)
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="예: 25"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-3 justify-end pt-2">
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-2xl font-semibold transition text-sm cursor-pointer"
                        >
                            필터 초기화
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white rounded-2xl font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] text-sm w-full md:w-auto cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <span>검색 중...</span>
                        ) : (
                            <>
                                <span>조건 검색하기</span>
                                <span className="text-base">🔍</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* 활성 필터 칩 */}
            {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">적용된 필터:</span>
                    {activeChips.map((chip) => (
                        <button
                            key={chip.key}
                            type="button"
                            onClick={() => removeFilter(chip.key)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/50 rounded-full text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/40 transition cursor-pointer"
                        >
                            {chip.label}
                            <span className="text-teal-400 dark:text-teal-500 text-sm leading-none">×</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
