import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PLACEHOLDER_MATCHES = [
  { rank: 1, jobTitle: "사무 보조원", region: "서울", jobType: "사무·행정", score: 92, status: "추천" },
  { rank: 2, jobTitle: "요양보호사 보조", region: "서울", jobType: "돌봄·요양", score: 85, status: "추천" },
  { rank: 3, jobTitle: "방과후 교실 강사", region: "인천", jobType: "교육·강사", score: 78, status: "추천" },
  { rank: 4, jobTitle: "편의점 계산원", region: "서울", jobType: "서비스·판매", score: 65, status: "검토 중" },
  { rank: 5, jobTitle: "공장 품질검사", region: "경기", jobType: "기술·생산", score: 58, status: "검토 중" },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-800 border-green-300"
      : score >= 65
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : "bg-gray-100 text-gray-700 border-gray-300";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-lg font-bold border ${color}`}>
      {score}점
    </span>
  );
}

export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
          <p className="text-xl text-gray-600 mt-2">
            회원님의 프로필에 맞는 일자리를 점수 순으로 보여드립니다.
          </p>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg text-blue-700 font-medium">추천 일자리</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-900">—</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg text-green-700 font-medium">최고 매칭 점수</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-900">—</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-lg text-yellow-700 font-medium">검토 중</CardDescription>
              <CardTitle className="text-4xl font-bold text-yellow-900">—</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 추천 목록 테이블 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">추천 목록 (플레이스홀더)</CardTitle>
            <CardDescription className="text-base text-gray-500">
              실제 데이터는 다음 단계에서 연결됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-lg font-bold text-gray-700 w-16">순위</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">일자리명</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">지역</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">직종</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700 text-center">점수</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700 text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PLACEHOLDER_MATCHES.map((match) => (
                  <TableRow key={match.rank} className="hover:bg-gray-50">
                    <TableCell className="text-xl font-bold text-blue-600">{match.rank}</TableCell>
                    <TableCell className="text-xl font-semibold text-gray-900">{match.jobTitle}</TableCell>
                    <TableCell className="text-lg text-gray-700">{match.region}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {match.jobType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreBadge score={match.score} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`text-base px-3 py-1 ${
                          match.status === "추천"
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {match.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
