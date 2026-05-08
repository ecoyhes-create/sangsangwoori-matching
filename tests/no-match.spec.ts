import { test, expect } from '@playwright/test'
import { resetDb, seedJob, getSeniorId } from './helpers'

test.beforeEach(async () => {
  await resetDb()
  // required_years=10 으로 설정해야 경력 조건(+1)까지 불일치하여 점수가 정확히 0이 됨.
  // (지역·직종 불일치만으로는 서울/경비/3 시니어가 경력 +1을 얻어 score=1이 되어 매칭으로 오인됨)
  await seedJob({ title: '기타 업무 공고', region: '기타', job_type: '기타', required_years: 10 })
})

test('엣지 시나리오: 조건 불일치 시 "현재 매칭되는 일자리가 없습니다" 안내가 표시된다', async ({
  page,
}) => {
  await page.goto('/register')

  await page.locator('#name').fill('테스트시니어노매치')

  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  await page.locator('#career').fill('3')

  await page.getByRole('button', { name: '프로필 등록하기' }).click()

  await expect(page.getByText(/등록이 완료되었습니다/)).toBeVisible({ timeout: 15_000 })

  const seniorId = await getSeniorId('테스트시니어노매치')
  await page.goto(`/recommendations?senior_id=${seniorId}`)

  // 매칭 없음 안내 박스 확인
  await expect(page.getByText('현재 매칭되는 일자리가 없습니다')).toBeVisible()
})
