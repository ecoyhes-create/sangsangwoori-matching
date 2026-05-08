import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { calcScore } from './matching.mjs'

// .env.local 로드
const envPath = join(process.cwd(), '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const seniors = [
  { name: '김영수', region: '서울',      desired_job: '경비', career_years: 10 },
  { name: '박미경', region: '경기',      desired_job: '청소', career_years: 5  },
  { name: '이정호', region: '서울',      desired_job: '조리', career_years: 15 },
  { name: '최순자', region: '인천',      desired_job: '돌봄', career_years: 8  },
  { name: '정대현', region: '서울',      desired_job: '경비', career_years: 3  },
  { name: '강옥분', region: '경기',      desired_job: '돌봄', career_years: 12 },
  { name: '윤기석', region: '서울',      desired_job: '조리', career_years: 7  },
  { name: '장미자', region: '인천',      desired_job: '청소', career_years: 4  },
  { name: '오상훈', region: '기타',      desired_job: '기타', career_years: 20 },
  { name: '임복순', region: '서울특별시', desired_job: '경비직', career_years: 6 },
]

const jobs = [
  { title: '아파트 경비원 A동',      region: '서울',       job_type: '경비', required_years: 5  },
  { title: '오피스 미화 주간반',      region: '경기',       job_type: '청소', required_years: 2  },
  { title: '어린이집 조리사',         region: '서울',       job_type: '조리', required_years: 10 },
  { title: '방문 요양보호사 서구',    region: '인천',       job_type: '돌봄', required_years: 5  },
  { title: '상가 야간 경비원',        region: '서울',       job_type: '경비', required_years: 3  },
  { title: '주간 돌봄 보조',          region: '경기',       job_type: '돌봄', required_years: 4  },
  { title: '단체급식 보조 조리',      region: '서울',       job_type: '조리', required_years: 3  },
  { title: '호텔 객실 미화',          region: '인천',       job_type: '청소', required_years: 2  },
  { title: '공원 환경 관리',          region: '서울',       job_type: '기타', required_years: 1  },
  { title: '동주민센터 안내 도우미',  region: '경기',       job_type: '기타', required_years: 0  },
  { title: '학교 경비원',             region: '서울특별시', job_type: '경비', required_years: 2  },
  { title: '병원 청소',               region: '인천',       job_type: '청소', required_years: 3  },
  { title: '주간 조리 보조',          region: '서울',       job_type: '조리', required_years: 5  },
  { title: '방문 돌봄 도우미',        region: '경기',       job_type: '돌봄', required_years: 6  },
  { title: '주차 관리원',             region: '서울',       job_type: '경비', required_years: 1  },
]

async function main() {
  console.log('=== seniors INSERT ===')
  const { data: insertedSeniors, error: se } = await db.from('seniors').insert(seniors).select('id, name, region, desired_job, career_years')
  if (se) { console.error('seniors INSERT 실패:', se.message); process.exit(1) }
  console.log(`seniors ${insertedSeniors.length}건 삽입 완료`)

  console.log('\n=== jobs INSERT ===')
  const { data: insertedJobs, error: je } = await db.from('jobs').insert(jobs).select('id, title, region, job_type, required_years')
  if (je) { console.error('jobs INSERT 실패:', je.message); process.exit(1) }
  console.log(`jobs ${insertedJobs.length}건 삽입 완료`)

  console.log('\n=== matches 재계산 ===')
  const matchRecords = []
  for (const senior of insertedSeniors) {
    for (const job of insertedJobs) {
      matchRecords.push({
        senior_id: senior.id,
        job_id: job.id,
        score: calcScore(senior, job),
        status: 'pending',
      })
    }
  }
  const { error: me } = await db.from('matches').upsert(matchRecords, { onConflict: 'senior_id,job_id' })
  if (me) { console.error('matches upsert 실패:', me.message); process.exit(1) }
  console.log(`matches ${matchRecords.length}건 upsert 완료`)

  console.log('\n=== 최종 레코드 수 ===')
  const [{ count: sc }, { count: jc }, { count: mc }] = await Promise.all([
    db.from('seniors').select('*', { count: 'exact', head: true }),
    db.from('jobs').select('*', { count: 'exact', head: true }),
    db.from('matches').select('*', { count: 'exact', head: true }),
  ])
  console.log(`seniors : ${sc}건`)
  console.log(`jobs    : ${jc}건`)
  console.log(`matches : ${mc}건`)
}

main()
