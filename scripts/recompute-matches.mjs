import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const envPath = join(process.cwd(), '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const REGION_MAP = { '서울특별시': '서울', '경기도': '경기', '인천광역시': '인천' }
const JOB_MAP = { '경비직': '경비', '청소직': '청소', '조리직': '조리', '돌봄직': '돌봄' }

const nr = v => REGION_MAP[v] ?? v
const nj = v => JOB_MAP[v] ?? v

function calcScore(senior, job) {
  let score = 0
  if (nr(senior.region) === nr(job.region)) score += 3
  if (nj(senior.desired_job) === nj(job.job_type)) score += 2
  if ((senior.career_years ?? 0) >= (job.required_years ?? 0)) score += 1
  return score
}

async function main() {
  const [{ data: seniors }, { data: jobs }] = await Promise.all([
    db.from('seniors').select('id, name, region, desired_job, career_years'),
    db.from('jobs').select('id, title, region, job_type, required_years'),
  ])

  const records = []
  for (const s of seniors) {
    for (const j of jobs) {
      records.push({ senior_id: s.id, job_id: j.id, score: calcScore(s, j), status: 'pending' })
    }
  }

  const { error } = await db.from('matches').upsert(records, { onConflict: 'senior_id,job_id' })
  if (error) { console.error('재계산 실패:', error.message); process.exit(1) }
  console.log(`matches ${records.length}건 재계산 완료\n`)

  // 임복순 결과 출력
  const imsoon = seniors.find(s => s.name === '임복순')
  if (imsoon) {
    console.log(`=== 임복순 (지역: ${imsoon.region} → 정규화: ${nr(imsoon.region)}, 직종: ${imsoon.desired_job} → 정규화: ${nj(imsoon.desired_job)}) ===`)
    const myMatches = records
      .filter(r => r.senior_id === imsoon.id)
      .map(r => ({ ...r, job: jobs.find(j => j.id === r.job_id) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
    for (const m of myMatches) {
      console.log(`  ${m.score}점 | ${m.job.title} (${m.job.region}/${m.job.job_type}, 요구경력 ${m.job.required_years}년)`)
    }
  }
}

main()
