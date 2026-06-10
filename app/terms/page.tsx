import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "이용약관",
};

export default function TermsPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2">이용약관</h1>
            <p className="text-sm text-gray-500 mb-8">시행일: 2026년 6월 10일</p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제1조 (목적)</h2>
            <p className="text-gray-700">
                본 약관은 청년노트(이하 &ldquo;사이트&rdquo;)의 이용 조건 및 절차, 이용자와 사이트의 권리·의무 등 기본 사항을 정함을 목적으로 합니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제2조 (정의)</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>&ldquo;사이트&rdquo;란 청년노트가 운영하는 웹사이트를 의미합니다.</li>
                <li>&ldquo;이용자&rdquo;란 사이트에 접속하여 정보를 이용하는 모든 사람을 의미합니다.</li>
                <li>&ldquo;콘텐츠&rdquo;란 사이트에 게시된 모든 글, 이미지, 데이터를 의미합니다.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-700">
                본 약관은 사이트에 게시함으로써 효력이 발생하며, 사이트는 필요한 경우 약관을 변경할 수 있습니다. 변경된 약관은 게시 즉시 효력을 가집니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제4조 (서비스 제공)</h2>
            <p className="text-gray-700 mb-2">사이트는 다음 서비스를 제공합니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>청년 대상 정부 지원금 및 정책 정보 제공</li>
                <li>지자체별 청년 혜택 정보 제공</li>
                <li>관련 정보의 정리 및 가이드</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">제5조 (정보의 정확성)</h2>
            <p className="text-gray-700">
                사이트는 정확한 정보 제공을 위해 노력하지만, 정책은 수시로 변경될 수 있으므로 실제 신청 전 반드시 해당 기관의 공식 안내를 확인하시기 바랍니다.
                사이트의 정보로 인한 직간접적 손해에 대해 책임을 지지 않습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제6조 (이용자의 의무)</h2>
            <p className="text-gray-700 mb-2">이용자는 다음 행위를 해서는 안 됩니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>콘텐츠를 무단으로 복제, 배포, 상업적으로 이용하는 행위</li>
                <li>사이트의 정상 운영을 방해하는 행위</li>
                <li>타인의 명예를 훼손하거나 허위 정보를 유포하는 행위</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">제7조 (저작권)</h2>
            <p className="text-gray-700">
                사이트에 게시된 콘텐츠의 저작권은 청년노트에 귀속되며, 무단 복제 및 상업적 이용을 금합니다.
                공식 출처 정보는 해당 기관의 정책에 따릅니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제8조 (광고)</h2>
            <p className="text-gray-700">
                사이트는 운영을 위해 제3자 광고 서비스(Google AdSense 등)를 통한 광고를 게재할 수 있습니다.
                광고 내용은 광고주의 책임이며, 사이트는 광고 내용에 대해 책임지지 않습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제9조 (면책)</h2>
            <p className="text-gray-700">
                사이트는 천재지변, 시스템 장애, 외부 서비스 중단 등 통제 불가 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">제10조 (준거법 및 관할)</h2>
            <p className="text-gray-700">
                본 약관은 대한민국 법률에 따라 해석되며, 사이트와 이용자 간 분쟁은 대한민국 법원에서 다룹니다.
            </p>
        </article>
    );
}