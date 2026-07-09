import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "사이트 소개",
    description: "청년노트는 청년이 받을 수 있는 정부 지원금과 혜택을 정리하는 정보 사이트입니다.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 tracking-tight">사이트 소개</h1>

            <section className="mb-10">
                <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="text-teal-600 dark:text-teal-400">#</span>
                    청년노트는 어떤 사이트인가요?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                    청년노트는 만 19~39세 청년이 받을 수 있는 정부 지원금, 청년 혜택, 지자체 사업을 한 곳에 정리하는 정보 사이트입니다.
                    복잡하고 흩어져 있는 정책 정보를 누구나 알기 쉽게 풀어드리는 것이 목표입니다.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="text-teal-600 dark:text-teal-400">#</span>
                    어떤 정보를 다루나요?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "금융/자산", desc: "청년도약계좌, 청약통장, 소득공제 펀드" },
                        { title: "주거", desc: "월세 지원, 전세 자금 대출, 청년 주택" },
                        { title: "일자리", desc: "내일배움카드, 구직활동지원금, 채움공제" },
                        { title: "교육/문화", desc: "문화패스, K-패스, 평생교육바우처" },
                        { title: "건강/생활", desc: "마음건강바우처, 청년몽땅정보통 등" },
                        { title: "지역별 혜택", desc: "서울, 경기, 부산 등 지자체별 청년 사업" },
                    ].map((item) => (
                        <div key={item.title} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100">{item.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="text-teal-600 dark:text-teal-400">#</span>
                    정보의 출처
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">본 사이트의 모든 정보는 신뢰할 수 있는 공식 출처를 기반으로 합니다:</p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    {["정부24 (www.gov.kr)", "복지로 (www.bokjiro.go.kr)", "온라인청년센터 (www.youthcenter.go.kr)", "각 부처 공식 보도자료 및 안내문"].map((src) => (
                        <li key={src} className="flex items-center gap-2 text-sm">
                            <span className="text-teal-600 dark:text-teal-400">•</span>
                            {src}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-10 p-6 bg-teal-50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                <h2 className="text-lg font-bold mb-3 text-teal-900 dark:text-teal-300">중요 안내</h2>
                <p className="text-sm text-teal-800/80 dark:text-teal-400/80 leading-relaxed">
                    정책은 정부 및 지자체 사정에 따라 수시로 변경될 수 있습니다. 본 사이트의 정보는 작성 시점 기준이며,
                    실제 신청 전에는 반드시 공식 채널을 통해 최신 정보를 재확인하시기 바랍니다.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">문의 및 제안</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    정보 오류 수정이나 새로운 정책 추천, 제휴 제안 등은 언제든 환영합니다.
                    <br />
                    <a href="/contact" className="text-teal-600 dark:text-teal-400 font-bold hover:underline inline-flex items-center gap-1 mt-2">
                        운영자에게 문의하기 <span>→</span>
                    </a>
                </p>
            </section>
        </article>
    );
}