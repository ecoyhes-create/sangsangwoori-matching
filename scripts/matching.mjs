export const REGION_MAP = { '서울특별시': '서울', '경기도': '경기', '인천광역시': '인천' }
export const JOB_MAP = { '경비직': '경비', '청소직': '청소', '조리직': '조리', '돌봄직': '돌봄' }

export const nr = (v) => REGION_MAP[v] ?? v
export const nj = (v) => JOB_MAP[v] ?? v

export function calcScore(senior, job) {
  let score = 0
  if (nr(senior.region) === nr(job.region)) score += 3
  if (nj(senior.desired_job) === nj(job.job_type)) score += 2
  if ((senior.career_years ?? 0) >= (job.required_years ?? 0)) score += 1
  return score
}
