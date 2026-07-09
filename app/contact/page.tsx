import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "문의하기",
    description: "청년노트 운영자에게 문의 또는 제안하기.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 tracking-tight">문의하기</h1>

            <p className="text-gray-600 dark:text-gray-400 mb-10 text-base md:text-lg leading-relaxed">
                청년노트에 대한 문의, 정보 오류 신고, 정책 추가 요청, 제휴 제안 등 모든 목소리를 기다립니다.
                운영자에게 직접 메일을 보내주시면 정성껏 답변해 드리겠습니다.
            </p>

            <div className="bg-gradient-to-br from-teal-50 to-white dark:from-slate-900 dark:to-slate-950 border border-teal-100 dark:border-slate-800 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-2 uppercase tracking-widest">이메일 주소</div>
                <a href="mailto:haram61423@gmail.com" className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-all">
                    haram61423@gmail.com
                </a>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                    평일 기준 24시간 이내에 확인하여 답변 드립니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span>👋</span> 이런 내용을 보내주세요
                    </h2>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        {["잘못된 정보나 오타 발견", "소개되었으면 하는 새로운 정책/혜택", "사용 중 불편함이나 개선 제안", "광고 및 비즈니스 제휴 문의"].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="text-teal-500 mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                    <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">운영 안내</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        청년노트는 1인 개발자가 운영하고 있는 독립적인 공간입니다. 
                        문의량이 많을 경우 답변이 다소 늦어질 수 있는 점 너그러이 양해 부탁드립니다. 
                        보내주시는 모든 의견은 서비스 발전에 큰 힘이 됩니다!
                    </p>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-8 border-t border-gray-100 dark:border-slate-800/80">
                개인정보는 문의 답변 목적으로만 사용되며, 관련 법령에 따라 안전하게 처리됩니다.
            </p>
        </article>
    );
}