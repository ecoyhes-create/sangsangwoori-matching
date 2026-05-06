import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            시니어 프로필 등록
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            아래 정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
              이름
            </Label>
            <Input
              id="name"
              placeholder="홍길동"
              className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              disabled
            />
          </div>

          {/* 지역 */}
          <div className="space-y-2">
            <Label htmlFor="region" className="text-xl font-semibold text-gray-800">
              거주 지역
            </Label>
            <Select disabled>
              <SelectTrigger className="h-14 text-xl border-2 border-gray-300">
                <SelectValue placeholder="지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seoul" className="text-lg py-3">서울</SelectItem>
                <SelectItem value="busan" className="text-lg py-3">부산</SelectItem>
                <SelectItem value="incheon" className="text-lg py-3">인천</SelectItem>
                <SelectItem value="daegu" className="text-lg py-3">대구</SelectItem>
                <SelectItem value="daejeon" className="text-lg py-3">대전</SelectItem>
                <SelectItem value="gwangju" className="text-lg py-3">광주</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 희망 직종 */}
          <div className="space-y-2">
            <Label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">
              희망 직종
            </Label>
            <Select disabled>
              <SelectTrigger className="h-14 text-xl border-2 border-gray-300">
                <SelectValue placeholder="직종을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office" className="text-lg py-3">사무·행정</SelectItem>
                <SelectItem value="care" className="text-lg py-3">돌봄·요양</SelectItem>
                <SelectItem value="education" className="text-lg py-3">교육·강사</SelectItem>
                <SelectItem value="service" className="text-lg py-3">서비스·판매</SelectItem>
                <SelectItem value="technical" className="text-lg py-3">기술·생산</SelectItem>
                <SelectItem value="other" className="text-lg py-3">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 경력 */}
          <div className="space-y-2">
            <Label htmlFor="career_years" className="text-xl font-semibold text-gray-800">
              경력 (년)
            </Label>
            <Input
              id="career_years"
              type="number"
              placeholder="예) 10"
              min={0}
              max={50}
              className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              disabled
            />
          </div>

          {/* 등록 버튼 */}
          <Button
            className="w-full h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4"
            size="lg"
            disabled
          >
            프로필 등록하기
          </Button>

          <p className="text-center text-base text-gray-500">
            * 기능은 다음 단계에서 구현됩니다
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
