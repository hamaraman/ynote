import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "개인정보처리방침",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight">개인정보처리방침</h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-10">시행일: 2026년 6월 10일</p>

            <p className="text-gray-700 dark:text-gray-400 mb-8 leading-relaxed">
                청년노트(이하 &ldquo;사이트&rdquo;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 및 관련 법령을 준수하여 안전하게 관리하고 있습니다.
            </p>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">1. 수집하는 개인정보 항목</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-3">사이트는 별도의 회원가입 없이 모든 정보를 열람할 수 있습니다. 다만, 서비스 개선 및 문의 대응을 위해 다음 정보가 수집될 수 있습니다:</p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc pl-5 text-sm">
                    <li>자동 수집 항목: IP 주소, 쿠키, 방문 일시, 브라우저 종류, 운영체제(OS), 접속 경로</li>
                    <li>문의 시 수집 항목: 성함(또는 닉네임), 이메일 주소, 문의 내용</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">2. 개인정보의 이용 목적</h2>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400 list-disc pl-5 text-sm">
                    <li>서비스 제공 및 안정적인 사이트 운영</li>
                    <li>이용자 문의 사항에 대한 답변 및 안내</li>
                    <li>접속 빈도 파악 및 서비스 이용 통계 분석</li>
                    <li>맞춤형 광고 제공 및 마케팅 활용 (제3자 광고 서비스 이용)</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">3. 보유 및 이용 기간</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    수집된 개인정보는 이용 목적이 달성된 후 지체 없이 파기하는 것을 원칙으로 합니다. 
                    단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">4. 쿠키(Cookie)의 사용 및 거부</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm leading-relaxed">사이트는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용합니다. 쿠키는 웹사이트 운영에 이용되는 서버가 이용자의 브라우저에 보내는 아주 작은 텍스트 파일입니다.</p>
                <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
                    이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 불편함이 있을 수 있습니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">5. 제3자 서비스 및 광고</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm">사이트 운영 및 수익 창출을 위해 다음의 제3자 서비스를 이용하며, 해당 서비스 제공업체가 쿠키를 사용할 수 있습니다:</p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-400 list-disc pl-5 text-sm mb-4">
                    <li><strong>Google AdSense</strong>: 방문자의 관심사에 기반한 맞춤형 광고를 제공합니다.</li>
                    <li><strong>Google Analytics</strong>: 사이트 방문 및 이용 행태 분석을 위해 사용됩니다.</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-400 text-xs">
                    Google의 광고 쿠키 사용 설정은 <a href="https://adssettings.google.com/" target="_blank" rel="noopener" className="text-teal-600 dark:text-teal-400 underline">Google 광고 설정</a> 페이지에서 직접 제어할 수 있습니다.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">6. 개인정보 보호 책임자</h2>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-semibold">이름: Haram Kim</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">이메일: <a href="mailto:haram61423@gmail.com" className="text-teal-600 dark:text-teal-400 underline font-medium">haram61423@gmail.com</a></p>
                </div>
            </section>

            <p className="text-gray-500 dark:text-gray-500 text-xs mt-12 pt-6 border-t border-gray-100 dark:border-slate-800">
                본 방침은 시행일로부터 적용되며, 법령 및 방침에 따른 내용의 추가, 삭제 및 수정이 있을 시에는 사이트를 통해 지체 없이 공지하겠습니다.
            </p>
        </article>
    );
}