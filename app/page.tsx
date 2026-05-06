import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PAGES = [
  {
    href: "/register",
    title: "시니어 프로필 등록",
    description: "이름, 지역, 희망 직종, 경력을 등록합니다",
    emoji: "📝",
    buttonLabel: "등록 화면으로",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    href: "/recommendations",
    title: "맞춤 일자리 추천",
    description: "규칙 기반 자동 매칭 결과를 점수 순으로 확인합니다",
    emoji: "⭐",
    buttonLabel: "추천 목록으로",
    color: "border-green-200 hover:border-green-400",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "미매칭 / 매칭 대기 / 배정 완료 현황을 관리합니다",
    emoji: "🗂️",
    buttonLabel: "대시보드로",
    color: "border-purple-200 hover:border-purple-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-5xl font-black text-gray-900">상상우리</h1>
          <p className="text-2xl text-gray-600 mt-3">시니어 ↔ 일자리 자동 매칭 시스템</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PAGES.map((page) => (
            <Card key={page.href} className={`border-2 transition-colors ${page.color}`}>
              <CardHeader className="pb-2">
                <div className="text-5xl mb-2">{page.emoji}</div>
                <CardTitle className="text-xl font-bold text-gray-900">{page.title}</CardTitle>
                <CardDescription className="text-base text-gray-600">{page.description}</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button asChild className="w-full h-12 text-lg font-semibold" variant="outline">
                  <Link href={page.href}>{page.buttonLabel}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-base text-gray-400">뼈대 완성 — 기능 구현은 다음 블록에서 진행합니다</p>
      </div>
    </main>
  );
}
