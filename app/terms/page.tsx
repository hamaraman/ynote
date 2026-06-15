import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "이용약관",
};

export default function TermsPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight">이용약관</h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-10">시행일: 2026년 6월 10일</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제1조 (목적)</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    본 약관은 청년노트(이하 &ldquo;사이트&rdquo;)의 이용 조건 및 절차, 이용자와 사이트의 권리·의무 등 기본적인 사항을 규정함을 목적으로 합니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제2조 (용어의 정의)</h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc pl-5 text-sm">
                    <li>&ldquo;사이트&rdquo;란 청년노트가 정보를 제공하기 위해 운영하는 웹사이트를 말합니다.</li>
                    <li>&ldquo;이용자&rdquo;란 사이트에 접속하여 정보를 이용하는 모든 고객을 의미합니다.</li>
                    <li>&ldquo;콘텐츠&rdquo;란 사이트에 게시된 모든 글, 이미지, 가이드, 데이터를 의미합니다.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제3조 (서비스의 내용)</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm">사이트는 이용자에게 다음의 서비스를 제공합니다:</p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc pl-5 text-sm">
                    <li>청년 대상 정부 및 지자체 지원금 정보 큐레이션</li>
                    <li>정책별 상세 자격 조건 및 신청 방법 가이드</li>
                    <li>기타 청년 생활에 도움이 되는 유용한 정보 제공</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제4조 (정보의 정확성 및 면책)</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                    사이트는 최신 API와 공식 보도자료를 통해 정확한 정보를 제공하려 노력합니다. 다만, 정책은 예산이나 행정 상황에 따라 예고 없이 변경될 수 있습니다.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                    <strong>주의:</strong> 사이트에서 제공하는 정보는 참고용이며 법적 효력이 없습니다. 실제 신청 전에는 반드시 주관 기관의 공식 공고문을 확인해야 하며, 사이트는 정보의 오류나 신청 결과에 대해 어떠한 법적 책임도 지지 않습니다.
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제5조 (저작권의 귀속)</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    사이트가 자체적으로 작성한 가이드 및 콘텐츠의 저작권은 사이트에 귀속됩니다. 이용자는 사이트의 사전 승낙 없이 콘텐츠를 무단 복제, 배포, 상업적으로 이용해서는 안 됩니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제6조 (광고의 게재)</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    사이트는 지속적인 서비스 운영을 위해 구글 애드센스 등 제3자 광고를 게재할 수 있습니다. 이용자는 서비스 이용 시 노출되는 광고 게재에 대해 동의하는 것으로 간주합니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">제7조 (약관의 변경)</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    사이트는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 사이트 내 게시함으로써 효력이 발생합니다.
                </p>
            </section>

            <p className="text-gray-500 dark:text-gray-500 text-xs mt-12 pt-6 border-t border-gray-100 dark:border-slate-800">
                본 약관에 명시되지 않은 사항은 대한민국의 관련 법령 또는 상관례에 따릅니다.
            </p>
        </article>
    );
}