import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import JobAddForm from './JobAddForm'

type Senior = { id: number; name: string; region: string; desired_job: string; career_years: number }
type Job = { id: number; title: string; region: string; job_type: string; required_years: number }
type Match = { senior_id: number; job_id: number; score: number; status: string }

function seniorStatus(seniorId: number, matches: Match[]): 'unmatched' | 'pending' | 'assigned' {
  const sm = matches.filter((m) => m.senior_id === seniorId)
  if (sm.some((m) => m.status === 'assigned' || m.status === 'done')) return 'assigned'
  if (sm.some((m) => m.score > 0 && m.status === 'pending')) return 'pending'
  return 'unmatched'
}

function maxScore(seniorId: number, matches: Match[]): number {
  const sm = matches.filter((m) => m.senior_id === seniorId)
  return sm.length ? Math.max(...sm.map((m) => m.score)) : 0
}

const STATUS_LABEL: Record<string, string> = {
  unmatched: '미매칭',
  pending: '매칭 대기',
  assigned: '배정 완료',
}
const STATUS_BADGE: Record<string, string> = {
  unmatched: 'bg-red-100 text-red-800 border-red-300',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  assigned: 'bg-green-100 text-green-800 border-green-300',
}

export default async function AdminPage() {
  const [{ data: seniors }, { data: jobs }, { data: matches }] = await Promise.all([
    supabase.from('seniors').select('id, name, region, desired_job, career_years').order('created_at', { ascending: false }),
    supabase.from('jobs').select('id, title, region, job_type, required_years').order('created_at', { ascending: false }),
    supabase.from('matches').select('senior_id, job_id, score, status'),
  ])

  const seniorList: Senior[] = seniors ?? []
  const jobList: Job[] = jobs ?? []
  const matchList: Match[] = matches ?? []

  const unmatchedCount = seniorList.filter((s) => seniorStatus(s.id, matchList) === 'unmatched').length
  const pendingCount = seniorList.filter((s) => seniorStatus(s.id, matchList) === 'pending').length
  const assignedCount = seniorList.filter((s) => seniorStatus(s.id, matchList) === 'assigned').length

  async function deleteJobAction(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'))
    await supabase.from('matches').delete().eq('job_id', id)
    await supabase.from('jobs').delete().eq('id', id)
    revalidatePath('/admin')
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 헤더 */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="text-xl text-gray-600 mt-1">상상우리 시니어 매칭 관리 시스템</p>
        </div>

        {/* 집계 카드 3종 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: '미매칭', count: unmatchedCount, color: 'border-red-200', header: 'text-red-700 bg-red-100' },
            { label: '매칭 대기', count: pendingCount, color: 'border-yellow-200', header: 'text-yellow-700 bg-yellow-100' },
            { label: '배정 완료', count: assignedCount, color: 'border-green-200', header: 'text-green-700 bg-green-100' },
          ].map((col) => (
            <Card key={col.label} className={`border-2 ${col.color} shadow-sm`}>
              <CardHeader className={`rounded-t-lg py-4 px-6 ${col.header}`}>
                <CardDescription className="text-lg font-semibold">{col.label}</CardDescription>
                <CardTitle className="text-5xl font-black mt-1">{col.count}</CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-6">
                <p className="text-sm text-gray-500">시니어 수</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 일자리 관리 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">일자리 관리</CardTitle>
            <CardDescription className="text-base text-gray-500">새 일자리를 등록하면 전체 시니어와 자동으로 매칭 점수를 계산합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <JobAddForm />

            {jobList.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-base font-bold text-gray-700">공고명</TableHead>
                    <TableHead className="text-base font-bold text-gray-700">지역</TableHead>
                    <TableHead className="text-base font-bold text-gray-700">직종</TableHead>
                    <TableHead className="text-base font-bold text-gray-700 text-center">요구 경력</TableHead>
                    <TableHead className="text-base font-bold text-gray-700 text-center">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobList.map((job) => (
                    <TableRow key={job.id} className="hover:bg-gray-50">
                      <TableCell className="text-base font-semibold text-gray-900">{job.title}</TableCell>
                      <TableCell className="text-base text-gray-700">{job.region}</TableCell>
                      <TableCell className="text-base text-gray-700">{job.job_type}</TableCell>
                      <TableCell className="text-base text-gray-700 text-center">{job.required_years}년</TableCell>
                      <TableCell className="text-center">
                        <form action={deleteJobAction}>
                          <input type="hidden" name="id" value={job.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border-2 border-red-300 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
                          >
                            삭제
                          </button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 시니어 목록 */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">시니어 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {seniorList.length === 0 ? (
              <p className="text-base text-gray-500 py-4">등록된 시니어가 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-base font-bold text-gray-700">이름</TableHead>
                    <TableHead className="text-base font-bold text-gray-700">지역</TableHead>
                    <TableHead className="text-base font-bold text-gray-700">희망 직종</TableHead>
                    <TableHead className="text-base font-bold text-gray-700 text-center">최고 점수</TableHead>
                    <TableHead className="text-base font-bold text-gray-700 text-center">상태</TableHead>
                    <TableHead className="text-base font-bold text-gray-700 text-center">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seniorList.map((senior) => {
                    const status = seniorStatus(senior.id, matchList)
                    const best = maxScore(senior.id, matchList)
                    return (
                      <TableRow key={senior.id} className="hover:bg-gray-50">
                        <TableCell className="text-lg font-semibold text-gray-900">{senior.name}</TableCell>
                        <TableCell className="text-base text-gray-700">{senior.region}</TableCell>
                        <TableCell className="text-base text-gray-700">{senior.desired_job}</TableCell>
                        <TableCell className="text-center">
                          {best > 0 ? (
                            <span className="text-lg font-bold text-blue-700">{best}점</span>
                          ) : (
                            <span className="text-base text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${STATUS_BADGE[status]}`}>
                            {STATUS_LABEL[status]}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`/recommendations?senior_id=${senior.id}`}
                            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                          >
                            상세 보기
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
