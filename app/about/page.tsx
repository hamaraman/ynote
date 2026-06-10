import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "사이트 소개",
    description: "청년노트는 청년이 받을 수 있는 정부 지원금과 혜택을 정리하는 정보 사이트입니다.",
};

export default function AboutPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">사이트 소개</h1>

            <h2 className="text-xl font-semibold mt-8 mb-3">청년노트는 어떤 사이트인가요?</h2>
            <p className="text-gray-700 leading-relaxed">
                청년노트는 만 19~39세 청년이 받을 수 있는 정부 지원금, 청년 혜택, 지자체 사업을 한 곳에 정리하는 정보 사이트입니다.
                흩어져 있는 정보를 알기 쉽게 풀어드리는 게 목표입니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">어떤 정보를 다루나요?</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>금융/자산: 청년도약계좌, 청약통장, 소득공제 펀드</li>
                <li>주거: 월세 지원, 전세 자금 대출, 청년 주택</li>
                <li>일자리: 내일배움카드, 구직활동지원금, 채움공제</li>
                <li>교육/문화: 문화패스, K-패스, 평생교육바우처</li>
                <li>건강/생활: 마음건강바우처 등</li>
                <li>지역별 혜택: 서울, 경기, 부산 등 지자체 사업</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">정보의 출처</h2>
            <p className="text-gray-700 mb-2">본 사이트의 모든 정보는 다음 공식 출처를 기반으로 작성됩니다:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>정부24 (www.gov.kr)</li>
                <li>복지로 (www.bokjiro.go.kr)</li>
                <li>온라인청년센터 (www.youthcenter.go.kr)</li>
                <li>각 부처 공식 보도자료 및 안내문</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-3">중요 안내</h2>
            <p className="text-gray-700 leading-relaxed">
                정책은 수시로 변경됩니다. 본 사이트의 정보는 작성 시점 기준이며,
                실제 신청 전 반드시 공식 출처에서 최신 정보를 확인하시기 바랍니다.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-3">문의</h2>
            <p className="text-gray-700">
                정보 오류나 추가하고 싶은 정책이 있으시면 <a href="/contact" className="text-teal-600 underline">문의하기</a>로 알려주세요.
            </p>
        </article>
    );
}