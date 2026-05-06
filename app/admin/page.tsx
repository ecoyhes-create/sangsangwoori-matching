import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_COLUMNS = [
  {
    key: "unmatched",
    label: "미매칭",
    color: "bg-red-50 border-red-200",
    headerColor: "text-red-700 bg-red-100",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    count: 0,
  },
  {
    key: "pending",
    label: "매칭 대기",
    color: "bg-yellow-50 border-yellow-200",
    headerColor: "text-yellow-700 bg-yellow-100",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    count: 0,
  },
  {
    key: "assigned",
    label: "배정 완료",
    color: "bg-green-50 border-green-200",
    headerColor: "text-green-700 bg-green-100",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
    count: 0,
  },
];

const PLACEHOLDER_ROWS = [
  { id: "M001", seniorName: "김영희", jobTitle: "사무 보조원", region: "서울", score: 92, status: "assigned" },
  { id: "M002", seniorName: "박철수", jobTitle: "방과후 교실 강사", region: "인천", score: 85, status: "pending" },
  { id: "M003", seniorName: "이순자", jobTitle: "요양보호사 보조", region: "서울", score: 78, status: "pending" },
  { id: "M004", seniorName: "최민수", jobTitle: "—", region: "경기", score: null, status: "unmatched" },
  { id: "M005", seniorName: "정옥자", jobTitle: "—", region: "부산", score: null, status: "unmatched" },
];

function StatusBadge({ status }: { status: string }) {
  const col = STATUS_COLUMNS.find((c) => c.key === status);
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-base font-semibold border ${col?.badgeClass}`}>
      {col?.label ?? status}
    </span>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
            <p className="text-xl text-gray-600 mt-1">상상우리 시니어 매칭 관리 시스템</p>
          </div>
          <Button
            className="h-14 px-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            disabled
          >
            매칭 실행
          </Button>
        </div>

        {/* 현황 카드 3종 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATUS_COLUMNS.map((col) => (
            <Card key={col.key} className={`border-2 ${col.color} shadow-sm`}>
              <CardHeader className={`rounded-t-lg py-4 px-6 ${col.headerColor}`}>
                <CardDescription className="text-lg font-semibold">{col.label}</CardDescription>
                <CardTitle className="text-5xl font-black mt-1">—</CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-6">
                <p className="text-base text-gray-500">실제 집계는 다음 단계에서 연결됩니다</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 매칭 현황 테이블 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">전체 매칭 현황 (플레이스홀더)</CardTitle>
            <CardDescription className="text-base text-gray-500">
              실제 데이터는 다음 단계에서 Supabase와 연결됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200">
                  <TableHead className="text-lg font-bold text-gray-700">ID</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">시니어</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">일자리</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700">지역</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700 text-center">점수</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700 text-center">상태</TableHead>
                  <TableHead className="text-lg font-bold text-gray-700 text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PLACEHOLDER_ROWS.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    <TableCell className="text-base text-gray-500 font-mono">{row.id}</TableCell>
                    <TableCell className="text-xl font-semibold text-gray-900">{row.seniorName}</TableCell>
                    <TableCell className="text-lg text-gray-700">{row.jobTitle}</TableCell>
                    <TableCell className="text-lg text-gray-700">{row.region}</TableCell>
                    <TableCell className="text-center">
                      {row.score !== null ? (
                        <span className="text-xl font-bold text-blue-700">{row.score}점</span>
                      ) : (
                        <span className="text-lg text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-base h-10 px-4 border-2"
                        disabled
                      >
                        상세보기
                      </Button>
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
