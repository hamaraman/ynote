import type { Metadata } from "next";
import PolicyCalculator from "@/components/PolicyCalculator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "청년 정책 맞춤 자격 진단기 & 혜택 계산기",
  description:
    "만 나이, 주거 상태, 취업 및 소득 조건에 맞춰 내가 받을 수 있는 청년도약계좌, 월세지원, 내일배움카드 등 맞춤 지원금을 1분 만에 계산해드립니다.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:underline">홈</Link>
        <span>&gt;</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">청년 정책 진단기</span>
      </nav>

      <PolicyCalculator />

      <section className="mt-12 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          📌 청년 정책 진단기 이용 안내 & 면책 고지
        </h3>
        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed list-disc pl-5">
          <li>
            본 진단 프로그램은 청년노트에서 제공하는 가이드 목적의 자가진단 툴입니다.
          </li>
          <li>
            실제 소득 산정(기초생활수급자, 중위소득 기준) 및 상세 자격 조건은 복지로, 온통청년, 각 지자체 공식 수행기관의 최종 기준에 따라 상이할 수 있습니다.
          </li>
          <li>
            정확한 지원 대상 여부는 개별 정책 가이드 페이지의 공식 신청 링크를 참조하세요.
          </li>
        </ul>
      </section>
    </div>
  );
}
