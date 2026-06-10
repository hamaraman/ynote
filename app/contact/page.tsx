import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "문의하기",
    description: "청년노트 운영자에게 문의 또는 제안하기.",
};

export default function ContactPage() {
    return (
        <article className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">문의하기</h1>

            <p className="text-gray-700 mb-6">
                청년노트에 대한 문의, 정보 오류 신고, 추가 요청은 아래 이메일로 보내주세요.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="text-sm text-gray-500 mb-1">이메일</div>
                <a href="mailto:haram61423@gmail.com" className="text-lg font-semibold text-teal-600">
                    haram61423@gmail.com
                </a>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-3">이런 내용 환영합니다</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>정보 오류나 오타 발견</li>
                <li>다뤘으면 하는 정책/지원금</li>
                <li>사이트 개선 제안</li>
                <li>광고/제휴 문의</li>
            </ul>

            <p className="text-sm text-gray-500 mt-8">
                답변은 영업일 기준 1~3일 이내 드립니다. (1인 운영이라 시간이 걸릴 수 있습니다)
            </p>
        </article>
    );
}