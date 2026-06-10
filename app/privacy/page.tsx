import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "개인정보처리방침",
};

export default function PrivacyPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
            <p className="text-sm text-gray-500 mb-8">시행일: 2026년 6월 10일</p>

            <p className="text-gray-700 mb-6">
                청년노트(이하 &ldquo;사이트&rdquo;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수합니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">1. 수집하는 개인정보 항목</h2>
            <p className="text-gray-700 mb-2">사이트는 별도의 회원가입 없이 이용 가능합니다. 다만 다음 정보가 자동 수집될 수 있습니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>IP 주소, 쿠키, 방문 일시, 브라우저 종류, OS, 접속 경로</li>
                <li>문의 시 입력하신 이메일 및 문의 내용</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>서비스 제공 및 사이트 운영</li>
                <li>이용자 문의 응대</li>
                <li>방문 통계 분석 및 서비스 개선</li>
                <li>맞춤형 광고 제공 (제3자 광고 서비스)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">3. 보유 및 이용 기간</h2>
            <p className="text-gray-700">
                수집된 개인정보는 이용 목적 달성 후 지체 없이 파기됩니다. 단, 관련 법령에 의해 보존이 필요한 경우 법정 기간 동안 보관합니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">4. 쿠키(Cookie)의 사용</h2>
            <p className="text-gray-700 mb-2">사이트는 이용자 경험 향상 및 통계 분석을 위해 쿠키를 사용합니다.</p>
            <p className="text-gray-700">
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">5. 제3자 서비스 이용</h2>
            <p className="text-gray-700 mb-2">사이트는 다음 제3자 서비스를 이용합니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-2">
                <li>Google AdSense: 맞춤형 광고 제공</li>
                <li>Google Analytics: 방문 통계 분석</li>
            </ul>
            <p className="text-gray-700">
                Google 광고 쿠키 사용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener" className="text-teal-600 underline">Google 광고 및 콘텐츠 네트워크 개인정보처리방침</a>에서 거부할 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">6. 제3자 제공</h2>
            <p className="text-gray-700">
                사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 법령에 의한 경우는 예외입니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">7. 이용자의 권리</h2>
            <p className="text-gray-700">
                이용자는 언제든 본인의 개인정보 조회, 수정, 삭제를 요청할 수 있으며, 하단 연락처로 요청 가능합니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">8. 개인정보 보호 책임자</h2>
            <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">이름: Haram Kim</p>
                <p className="text-gray-700">이메일: <a href="mailto:haram61423@gmail.com" className="text-teal-600 underline">haram61423@gmail.com</a></p>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-3">9. 방침 변경</h2>
            <p className="text-gray-700">
                본 방침은 시행일로부터 적용되며, 변경 시 사이트 공지를 통해 안내합니다.
            </p>
        </article>
    );
}