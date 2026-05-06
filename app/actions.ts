'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

type Senior = { region: string; desired_job: string; career_years: number }
type Job = { region: string; job_type: string; required_years: number }

function calcScore(senior: Senior, job: Job): number {
  let score = 0
  if (senior.region === job.region) score += 3
  if (senior.desired_job === job.job_type) score += 2
  if ((senior.career_years ?? 0) >= (job.required_years ?? 0)) score += 1
  return score
}

async function computeMatchesForSenior(seniorId: number) {
  const [{ data: senior }, { data: jobs }] = await Promise.all([
    supabase.from('seniors').select('region, desired_job, career_years').eq('id', seniorId).single(),
    supabase.from('jobs').select('id, region, job_type, required_years'),
  ])
  if (!senior || !jobs?.length) return

  const records = jobs.map((job) => ({
    senior_id: seniorId,
    job_id: job.id,
    score: calcScore(senior, job),
    status: 'pending',
  }))
  await supabase.from('matches').upsert(records, { onConflict: 'senior_id,job_id' })
}

async function computeMatchesForJob(jobId: number) {
  const [{ data: job }, { data: seniors }] = await Promise.all([
    supabase.from('jobs').select('region, job_type, required_years').eq('id', jobId).single(),
    supabase.from('seniors').select('id, region, desired_job, career_years'),
  ])
  if (!job || !seniors?.length) return

  const records = seniors.map((senior) => ({
    senior_id: senior.id,
    job_id: jobId,
    score: calcScore(senior, job),
    status: 'pending',
  }))
  await supabase.from('matches').upsert(records, { onConflict: 'senior_id,job_id' })
}

export async function insertSenior(data: {
  name: string
  region: string
  desired_job: string
  career_years: number
}): Promise<{ success: boolean; error?: string; seniorId?: number }> {
  const { data: senior, error } = await supabase
    .from('seniors')
    .insert(data)
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  await computeMatchesForSenior(senior.id)
  revalidatePath('/admin')
  revalidatePath('/recommendations')

  return { success: true, seniorId: senior.id }
}

export async function insertJob(data: {
  title: string
  region: string
  job_type: string
  required_years: number
}): Promise<{ success: boolean; error?: string }> {
  const { data: job, error } = await supabase
    .from('jobs')
    .insert(data)
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  await computeMatchesForJob(job.id)
  revalidatePath('/admin')

  return { success: true }
}

export async function deleteJob(jobId: number): Promise<{ success: boolean; error?: string }> {
  const { error: matchError } = await supabase.from('matches').delete().eq('job_id', jobId)
  if (matchError) return { success: false, error: matchError.message }

  const { error } = await supabase.from('jobs').delete().eq('id', jobId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin')
  return { success: true }
}
