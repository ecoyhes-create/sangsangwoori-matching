import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^=]+)=(.+)$/)
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim()
    }
  }
}

loadEnvLocal()

export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// CI: 전체 삭제 / 로컬: 이 세션 이후 생성된 데이터만 삭제 (시연 데이터 보호)
const TEST_SESSION_START = new Date().toISOString()

/** 테스트 전 데이터 초기화 (matches → seniors → jobs 순서) */
export async function resetDb() {
  const since = process.env.CI ? '2000-01-01' : TEST_SESSION_START
  await db.from('matches').delete().gte('created_at', since)
  await db.from('seniors').delete().gte('created_at', since)
  await db.from('jobs').delete().gte('created_at', since)
}

export async function seedJob(data: {
  title: string
  region: string
  job_type: string
  required_years: number
}): Promise<string> {
  const { data: job, error } = await db.from('jobs').insert(data).select('id').single()
  if (error) throw new Error(`seedJob 실패: ${error.message}`)
  return job!.id as string
}

export async function getSeniorId(name: string): Promise<string> {
  const { data, error } = await db
    .from('seniors')
    .select('id')
    .eq('name', name)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error) throw new Error(`getSeniorId 실패: ${error.message}`)
  return data!.id as string
}
