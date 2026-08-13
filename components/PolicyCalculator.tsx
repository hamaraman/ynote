"use client";

import { useState } from "react";
import Link from "next/link";

interface Recommendation {
  title: string;
  desc: string;
  slug: string;
  badge: string;
  estBenefit: string;
}

export default function PolicyCalculator() {
  const [age, setAge] = useState<number>(24);
  const [housing, setHousing] = useState<"rent" | "home" | "other">("rent");
  const [job, setJob] = useState<"seeking" | "employed" | "student" | "startup">("employed");
  const [income, setIncome] = useState<"low" | "mid" | "high">("mid");

  const [hasCalculated, setHasCalculated] = useState(false);

  const getRecommendations = (): Recommendation[] => {
    const list: Recommendation[] = [];

    // 자산 형성 (청년도약계좌)
    if (age >= 19 && age <= 34) {
      list.push({
        title: "청년도약계좌",
        desc: "5년 동안 매월 최대 70만 원 납입 시 정부지원금 + 비과세 혜택으로 목돈 마련!",
        slug: "youth-leap-account",
        badge: "자산 형성",
        estBenefit: "최대 5,000만 원 목돈 형성",
      });
    }

    // 월세 지원
    if (housing === "rent" && income !== "high") {
      list.push({
        title: "청년 월세 한시 특별지원",
        desc: "부모님과 별도 거주하는 무주택 청년에게 월 최대 20만 원씩 12개월간 월세 지원",
        slug: "youth-rent-support",
        badge: "주거 지원",
        estBenefit: "최대 240만 원 환급",
      });
    }

    // 교통비 지원
    list.push({
      title: "K-패스 / 기후동행카드",
      desc: "대중교통 이용 횟수 및 이동 동선에 맞춘 교통비 환급 및 무제한 정기권 혜택",
      slug: "pass",
      badge: "교통 혜택",
      estBenefit: "월 평균 2~3만 원 절약",
    });

    // 구직 / 직업 훈련
    if (job === "seeking" || job === "student") {
      list.push({
        title: "국민내일배움카드",
        desc: "직업 훈련 및 자기계발 수강료를 최대 500만 원까지 지원받는 필수 카드",
        slug: "learning-card",
        badge: "취업·교육",
        estBenefit: "최대 500만 원 훈련비 지원",
      });
    } else if (job === "employed" && income === "low") {
      list.push({
        title: "중소기업 취업청년 전월세보증금 대출",
        desc: "낮은 금리로 전월세 보증금을 대출받아 주거비 부담을 획기적으로 낮춤",
        slug: "sme-jeonse-loan",
        badge: "주거·대출",
        estBenefit: "저금리 주거 보증금 대출",
      });
    }

    // 창업자
    if (job === "startup") {
      list.push({
        title: "청년창업사관학교 & 초기창업패키지",
        desc: "아이템 발굴부터 사업화 자금, 멘토링까지 최대 1억 원 지원",
        slug: "youth-startup-academy",
        badge: "창업 지원",
        estBenefit: "사업화 자금 지원",
      });
    }

    return list;
  };

  const results = getRecommendations();

  return (
    <div className="bg-gradient-to-br from-teal-500/10 via-white to-teal-500/5 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 rounded-3xl p-6 md:p-8 shadow-lg my-8">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs rounded-full mb-2">
          ⚡ 1분 맞춤 진단
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          나에게 꼭 맞는 청년 정책 & 혜택 계산기
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          간단한 기본 조건을 선택하면 받을 수 있는 정부 지원금과 예상 혜택을 계산해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto bg-white/80 dark:bg-slate-950/80 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
        {/* 만 나이 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            🎂 만 나이 (만 {age}세)
          </label>
          <input
            type="range"
            min="18"
            max="39"
            value={age}
            onChange={(e) => {
              setAge(Number(e.target.value));
              setHasCalculated(true);
            }}
            className="w-full accent-teal-600 cursor-pointer h-2 bg-gray-200 dark:bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
            <span>만 18세</span>
            <span>만 29세</span>
            <span>만 39세</span>
          </div>
        </div>

        {/* 주거 형태 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            🏠 주거 형태
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rent", label: "월세/전세" },
              { id: "home", label: "부모님 동거" },
              { id: "other", label: "기타/기숙사" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setHousing(item.id as any);
                  setHasCalculated(true);
                }}
                className={`py-2 px-1 text-xs rounded-xl font-bold border transition ${
                  housing === item.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 현재 상태 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            💼 현재 상태
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "employed", label: "직장인 / 재직자" },
              { id: "seeking", label: "취업 준비생" },
              { id: "student", label: "대학생 / 대학원생" },
              { id: "startup", label: "청년 창업자" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setJob(item.id as any);
                  setHasCalculated(true);
                }}
                className={`py-2 px-2 text-xs rounded-xl font-bold border transition ${
                  job === item.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 소득 구간 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
            💰 소득 수준
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "low", label: "중위 100% 이하" },
              { id: "mid", label: "중위 180% 이하" },
              { id: "high", label: "일반/해당없음" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIncome(item.id as any);
                  setHasCalculated(true);
                }}
                className={`py-2 px-1 text-xs rounded-xl font-bold border transition ${
                  income === item.id
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 진단 결과 카드 */}
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎁</span> 추천 맞춤 정책 ({results.length}건)
          </h3>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
            실시간 진단 적용됨
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-teal-500/30 transition shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 rounded-md">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    {item.estBenefit}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <Link
                href={`/policy/${item.slug}`}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 text-center font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
              >
                상세 자격 조건 & 신청법 확인 <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
