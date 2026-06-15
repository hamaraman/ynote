import Link from "next/link";
import { getPolicies } from "@/lib/youthApi";
import PolicyCard from "@/components/PolicyCard";

const categories = [
    { name: "금융/자산", href: "/category/finance", icon: "💰", desc: "청년도약계좌, 청약통장, 소득공제펀드", color: "bg-amber-50 hover:bg-amber-100" },
    { name: "주거", href: "/category/housing", icon: "🏠", desc: "월세지원, 전세대출, 청년주택", color: "bg-rose-50 hover:bg-rose-100" },
    { name: "일자리", href: "/category/job", icon: "💼", desc: "내일배움카드, 구직지원금, 채움공제", color: "bg-sky-50 hover:bg-sky-100" },
    { name: "교육/문화", href: "/category/edu", icon: "📚", desc: "문화패스, K-패스, 평생교육바우처", color: "bg-violet-50 hover:bg-violet-100" },
    { name: "건강/생활", href: "/category/life", icon: "🏥", desc: "마음건강바우처, 청년몽땅정보통", color: "bg-emerald-50 hover:bg-emerald-100" },
    { name: "지역별 혜택", href: "/category/region", icon: "📍", desc: "서울/경기/부산 등 지자체 지원", color: "bg-orange-50 hover:bg-orange-100" },
];

const popular = [
    { title: "청년도약계좌 신청 방법과 조건 총정리", href: "/policy/youth-leap-account", cat: "금융" },
    { title: "청년 월세 지원금, 지역별로 다 모았다", href: "/policy/youth-rent-support", cat: "주거" },
    { title: "국민내일배움카드 신청부터 사용까지", href: "/policy/learning-card", cat: "일자리" },
];

export default async function Home() {
    const apiData = await getPolicies({ pageSize: 24 }, 60 * 30);
    const recentPolicies = apiData.result?.youthPolicyList ?? [];
    const totalCount = apiData.result?.pagging?.totCount ?? 0;

    return (
        <div className="max-w-5xl mx-auto px-4">
            <section className="py-12 md:py-16 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                    청년 정책, <span className="text-teal-600">한눈에</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-8">
                    청년도약계좌부터 월세지원까지 — 받을 수 있는 모든 혜택을 친근하게 정리합니다.
                </p>

                <form action="/search" method="get" className="max-w-xl mx-auto">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="q"
                            placeholder="정책을 검색해보세요 (예: 청년도약계좌, 월세지원)"
                            className="flex-1 px-5 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition shadow-sm"
                        >
                            검색
                        </button>
                    </div>
                </form>

                <p className="text-sm text-gray-500 mt-4">
                    온통청년 API 기반 총 {totalCount.toLocaleString()}개 정책 지원
                </p>
            </section>

            <section className="pb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">카테고리</h2>
                    <Link href="/search" className="text-sm text-teal-600 hover:underline">
                        전체 검색 →
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((c) => (
                        <Link key={c.href} href={c.href} className={`${c.color} p-5 rounded-2xl transition border border-transparent hover:border-gray-200 hover:shadow-md`}>
                            <div className="text-2xl mb-2">{c.icon}</div>
                            <div className="font-semibold mb-1">{c.name}</div>
                            <div className="text-sm text-gray-600">{c.desc}</div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="pb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">📖 읽어보기</h2>
                </div>
                <div className="grid md:grid-cols-1 gap-4">
                    {popular.map((p) => (
                        <Link key={p.href} href={p.href} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                                    {p.cat}
                                </span>
                                <span className="font-medium">{p.title}</span>
                                <span className="text-gray-400 ml-auto">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {recentPolicies.length > 0 && (
                <section className="pb-16">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">📋 정부 정책</h2>
                        <Link href="/search" className="text-sm text-teal-600 hover:underline">
                            더 많은 정책 보기 →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentPolicies.map((p) => (
                            <PolicyCard key={p.plcyNo} policy={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}