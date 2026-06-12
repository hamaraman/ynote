import Link from "next/link";
import { getPolicies } from "@/lib/youthApi";

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
  { title: "국민내일배움카드 신청부터 사용까지", href: "/policy/tomorrow-learning-card", cat: "일자리" },
];

export default async function Home() {
  const apiData = await getPolicies({}, 60 * 30);
  const recentPolicies = apiData.result?.youthPolicyList ?? [];

  return (
      <div className="max-w-5xl mx-auto px-4">
        <section className="py-12 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            청년 정책, <span className="text-teal-600">한눈에</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
            청년도약계좌부터 월세지원까지 — 받을 수 있는 모든 혜택을 친근하게 정리합니다.
          </p>
        </section>

        <section className="pb-12">
          <h2 className="text-xl font-bold mb-4">카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((c) => (
                <Link key={c.href} href={c.href} className={`${c.color} p-5 rounded-2xl transition border border-transparent hover:border-gray-200`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-semibold mb-1">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.desc}</div>
                </Link>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <h2 className="text-xl font-bold mb-4">인기 정책 가이드</h2>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {popular.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="flex items-center justify-between py-4 hover:text-teal-600 transition">
                <span>
                  <span className="text-xs text-gray-500 mr-2">[{p.cat}]</span>
                  {p.title}
                </span>
                    <span className="text-gray-400">→</span>
                  </Link>
                </li>
            ))}
          </ul>
        </section>

        {recentPolicies.length > 0 && (
          <section className="pb-16">
            <h2 className="text-xl font-bold mb-4">
              최신 정부 정책
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({apiData.result?.pagging?.totCount?.toLocaleString() ?? recentPolicies.length}건)
              </span>
            </h2>
            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {recentPolicies.slice(0, 8).map((p) => (
                <li key={p.plcyNo}>
                  <Link href={`/policy/${p.plcyNo}`} className="flex items-center justify-between py-4 hover:text-teal-600 transition">
                    <span>
                      <span className="text-xs text-gray-500 mr-2">[{p.lclsfNm}]</span>
                      {p.plcyNm}
                    </span>
                    <span className="text-gray-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
  );
}