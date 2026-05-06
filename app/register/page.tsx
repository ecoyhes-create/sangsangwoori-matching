'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { insertSenior } from '@/app/actions'

const REGIONS = ['서울', '경기', '인천', '기타']
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타']

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div className="rounded-lg bg-red-50 border border-red-300 px-4 py-2 text-base font-semibold text-red-700">
      ⚠ {message}
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [region, setRegion] = useState<string | null>(null)
  const [desiredJob, setDesiredJob] = useState<string | null>(null)
  const [careerYears, setCareerYears] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = '이름을 입력해 주세요'
    if (!region) errs.region = '지역을 선택해 주세요'
    if (!desiredJob) errs.desiredJob = '희망 직종을 선택해 주세요'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSuccess(false)
    startTransition(async () => {
      const result = await insertSenior({
        name: name.trim(),
        region: region!,
        desired_job: desiredJob!,
        career_years: careerYears ? Number(careerYears) : 0,
      })
      if (result.success) {
        setSuccess(true)
        setName('')
        setRegion(null)
        setDesiredJob(null)
        setCareerYears('')
      } else {
        setErrors({ submit: result.error ?? '등록 중 오류가 발생했습니다' })
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900">시니어 프로필 등록</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            아래 정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border-2 border-green-400 px-5 py-4 text-xl font-bold text-green-800">
              ✓ 등록이 완료되었습니다
            </div>
          )}
          {errors.submit && (
            <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-400 px-5 py-4 text-lg font-semibold text-red-800">
              ⚠ {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                이름 <span className="text-red-500">*</span>
              </Label>
              <FieldError message={errors.name} />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* 지역 */}
            <div className="space-y-2">
              <Label className="text-xl font-semibold text-gray-800">
                거주 지역 <span className="text-red-500">*</span>
              </Label>
              <FieldError message={errors.region} />
              <Select value={region ?? undefined} onValueChange={(val) => setRegion(val ?? null)}>
                <SelectTrigger className="w-full h-14 text-xl border-2 border-gray-300">
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r} className="text-lg py-3">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 희망 직종 */}
            <div className="space-y-2">
              <Label className="text-xl font-semibold text-gray-800">
                희망 직종 <span className="text-red-500">*</span>
              </Label>
              <FieldError message={errors.desiredJob} />
              <Select value={desiredJob ?? undefined} onValueChange={(val) => setDesiredJob(val ?? null)}>
                <SelectTrigger className="w-full h-14 text-xl border-2 border-gray-300">
                  <SelectValue placeholder="직종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((j) => (
                    <SelectItem key={j} value={j} className="text-lg py-3">
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 경력 */}
            <div className="space-y-2">
              <Label htmlFor="career" className="text-xl font-semibold text-gray-800">
                경력 (년)
              </Label>
              <Input
                id="career"
                type="number"
                value={careerYears}
                onChange={(e) => setCareerYears(e.target.value)}
                placeholder="예) 10"
                min={0}
                max={50}
                className="h-14 text-xl px-4 border-2 border-gray-300 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isPending ? '등록 중...' : '프로필 등록하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
