import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { assignJob } from '@/app/actions'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score === 6
      ? 'bg-yellow-100 text-yellow-800 border-yellow-400'
      : score >= 4
      ? 'bg-green-100 text-green-800 border-green-400'
      : 'bg-gray-100 text-gray-700 border-gray-300'
  return (
    <span className={`inline-block px-4 py-1 rounded-full text-xl font-bold border-2 ${cls}`}>
      {score}점
    </span>
  )
}

export default async function RecommendationsPage({ searchParams }: { searchParams: SearchParams }) {
  const { senior_id } = await searchParams

  if (!senior_id || Array.isArray(senior_id)) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="rounded-xl bg-yellow-50 border-2 border-yellow-300 px-8 py-6 text-xl font-semibold text-yellow-800">
          시니어 ID가 필요합니다. 담당자 대시보드에서 시니어를 선택해 주세요.
        </div>
      </main>
    )
  }

  const seniorId = Number(senior_id)

  const [{ data: senior }, { data: matchRows }] = await Promise.all([
    supabase.from('seniors').select('name, region, desired_job').eq('id', seniorId).single(),
    supabase
      .from('matches')
      .select('score, status, job_id')
      .eq('senior_id', seniorId)
      .order('score', { ascending: false }),
  ])

  const positiveMatches = (matchRows ?? []).filter((m) => m.score > 0)
  const jobIds = positiveMatches.map((m) => m.job_id)

  let jobMap: Record<number, { title: string; region: string; job_type: string }> = {}
  if (jobIds.length > 0) {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, region, job_type')
      .in('id', jobIds)
    jobs?.forEach((j) => {
      jobMap[j.id] = { title: j.title, region: j.region, job_type: j.job_type }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <Link href="/admin" className="inline-block text-base font-semibold text-blue-600 hover:underline">
          ← 대시보드로 돌아가기
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-gray-900">맞춤 일자리 추천</h1>
          {senior && (
            <p className="text-xl text-gray-600 mt-2">
              {senior.name} · {senior.region} · {senior.desired_job}
            </p>
          )}
        </div>

        {positiveMatches.length === 0 ? (
          <div className="rounded-xl bg-gray-100 border-2 border-gray-300 px-6 py-6 text-xl font-semibold text-gray-600">
            현재 매칭되는 일자리가 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {positiveMatches.map((m) => {
              const job = jobMap[m.job_id]
              if (!job) return null
              return (
                <div
                  key={m.job_id}
                  className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{job.title}</p>
                    <p className="text-lg text-gray-600">
                      {job.region} · {job.job_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <ScoreBadge score={m.score} />
                    {m.status === 'assigned' ? (
                      <span className="inline-block px-4 py-1 rounded-full text-base font-bold border-2 bg-green-100 text-green-800 border-green-400">
                        배정 완료
                      </span>
                    ) : (
                      <form action={assignJob.bind(null, { senior_id: seniorId, job_id: m.job_id })}>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center h-10 px-5 rounded-lg border-2 border-blue-400 bg-blue-50 text-blue-700 text-base font-semibold hover:bg-blue-100 transition-colors"
                        >
                          배정하기
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
