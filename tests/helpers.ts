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

/** 테스트 전 전체 데이터 초기화 (matches → seniors → jobs 순서) */
export async function resetDb() {
  await db.from('matches').delete().gte('created_at', '2000-01-01')
  await db.from('seniors').delete().gte('created_at', '2000-01-01')
  await db.from('jobs').delete().gte('created_at', '2000-01-01')
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
