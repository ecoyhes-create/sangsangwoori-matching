'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { insertJob } from '@/app/actions'

const REGIONS = ['서울', '경기', '인천', '기타']
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타']

export default function JobAddForm() {
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState<string | null>(null)
  const [jobType, setJobType] = useState<string | null>(null)
  const [requiredYears, setRequiredYears] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = '공고명을 입력해 주세요'
    if (!region) errs.region = '지역을 선택해 주세요'
    if (!jobType) errs.jobType = '직종을 선택해 주세요'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSuccess(false)
    startTransition(async () => {
      const result = await insertJob({
        title: title.trim(),
        region: region!,
        job_type: jobType!,
        required_years: requiredYears ? Number(requiredYears) : 0,
      })
      if (result.success) {
        setSuccess(true)
        setTitle('')
        setRegion(null)
        setJobType(null)
        setRequiredYears('')
      } else {
        setErrors({ submit: result.error ?? '등록 중 오류가 발생했습니다' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded-lg bg-green-50 border-2 border-green-400 px-4 py-3 text-base font-bold text-green-800">
          ✓ 일자리가 등록되었습니다
        </div>
      )}
      {errors.submit && (
        <div className="rounded-lg bg-red-50 border-2 border-red-400 px-4 py-3 text-base font-semibold text-red-800">
          ⚠ {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 공고명 */}
        <div className="sm:col-span-2 space-y-1">
          {errors.title && (
            <p className="text-sm font-semibold text-red-600">⚠ {errors.title}</p>
          )}
          <Label className="text-base font-semibold text-gray-700">
            공고명 <span className="text-red-500">*</span>
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 아파트 경비원"
            className="h-11 text-base border-2 border-gray-300"
          />
        </div>

        {/* 지역 */}
        <div className="space-y-1">
          {errors.region && (
            <p className="text-sm font-semibold text-red-600">⚠ {errors.region}</p>
          )}
          <Label className="text-base font-semibold text-gray-700">
            지역 <span className="text-red-500">*</span>
          </Label>
          <Select value={region ?? undefined} onValueChange={(val) => setRegion(val ?? null)}>
            <SelectTrigger className="w-full h-11 text-base border-2 border-gray-300">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 직종 */}
        <div className="space-y-1">
          {errors.jobType && (
            <p className="text-sm font-semibold text-red-600">⚠ {errors.jobType}</p>
          )}
          <Label className="text-base font-semibold text-gray-700">
            직종 <span className="text-red-500">*</span>
          </Label>
          <Select value={jobType ?? undefined} onValueChange={(val) => setJobType(val ?? null)}>
            <SelectTrigger className="w-full h-11 text-base border-2 border-gray-300">
              <SelectValue placeholder="직종 선택" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((j) => (
                <SelectItem key={j} value={j}>{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 요구 경력 */}
        <div className="space-y-1">
          <Label className="text-base font-semibold text-gray-700">요구 경력 (년)</Label>
          <Input
            type="number"
            value={requiredYears}
            onChange={(e) => setRequiredYears(e.target.value)}
            placeholder="예) 3"
            min={0}
            max={50}
            className="h-11 text-base border-2 border-gray-300"
          />
        </div>

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {isPending ? '등록 중...' : '일자리 등록'}
          </Button>
        </div>
      </div>
    </form>
  )
}
