"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DiagnosisPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    
    const [age, setAge] = useState("");
    const [region, setRegion] = useState("");
    const [category, setCategory] = useState("");

    const handleNext = () => {
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            // Redirect to search with filters applied!
            const params = new URLSearchParams();
            if (age) params.set("age", age);
            if (region && region !== "전국") params.set("region", region);
            if (category) params.set("cat", category);
            
            router.push(`/search?${params.toString()}`);
        }
    };

    const categories = [
        { label: "주거", slug: "주거", desc: "청년 월세, 임대주택, 전세대출 등" },
        { label: "교육", slug: "교육", desc: "내일배움카드, 교육비, 학자금 등" },
        { label: "취업", slug: "취업", desc: "구직수당, 일경험, 인턴십 등" },
        { label: "창업", slug: "창업", desc: "스타트업 패키지, 창업자금 등" },
        { label: "금융", slug: "금융", desc: "도약계좌, 목돈마련, 적금 등" },
        { label: "생활/건강", slug: "생활", desc: "심리상담, 의료비, 건강검진 등" },
        { label: "문화", slug: "문화", desc: "문화예술패스, 전시/공연 할인 등" },
    ];

    const regions = ["전국", "서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산", "제주"];

    return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
            {/* Header progress */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-blue-600 dark:text-blue-400">
                    <span>맞춤 정책 진단</span>
                    <span>{step} / 3 단계</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm text-left">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">나이를 입력해주세요</h2>
                            <p className="text-xs font-bold text-gray-400">지원 연령 기준(만 나이)에 부합하는 정책을 탐색합니다.</p>
                        </div>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="예: 25 (숫자만 입력)"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">거주하는 지역은 어디인가요?</h2>
                            <p className="text-xs font-bold text-gray-400">지자체별 청년 특별 혜택을 필터링합니다.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {regions.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRegion(r)}
                                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-200 text-center cursor-pointer flex items-center justify-center ${
                                        region === r
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                                            : "bg-white dark:bg-slate-800 hover:bg-gray-50 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">가장 관심있는 정책 분야는?</h2>
                            <p className="text-xs font-bold text-gray-400">우선순위로 조회할 카테고리를 하나 골라보세요.</p>
                        </div>
                        <div className="space-y-3">
                            {categories.map((c) => (
                                <button
                                    key={c.slug}
                                    onClick={() => setCategory(c.slug)}
                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                                        category === c.slug
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/15"
                                            : "bg-white dark:bg-slate-800 hover:bg-gray-50 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <div>
                                        <div className="text-sm font-black">{c.label}</div>
                                        <div className={`text-[10px] ${category === c.slug ? "text-blue-100" : "text-gray-400"}`}>{c.desc}</div>
                                    </div>
                                    <span className="text-xs">&gt;</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(prev => prev - 1)}
                            className="px-5 py-3 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                            이전
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={step === 1 && !age}
                        className={`flex-1 px-5 py-3 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            (step === 1 && !age)
                                ? "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/15"
                        }`}
                    >
                        {step === 3 ? "진단 완료 및 정책 매칭" : "다음"}
                    </button>
                </div>
            </div>
        </div>
    );
}
