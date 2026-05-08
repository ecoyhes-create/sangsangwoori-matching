import { test, expect } from '@playwright/test'
import { resetDb, seedJob, getSeniorId } from './helpers'

test.beforeEach(async () => {
  await resetDb()
  await seedJob({ title: '서울 경비원 공고', region: '서울', job_type: '경비', required_years: 3 })
})

test('정상 시나리오: 6점 금색 배지 카드가 추천 목록 상단에 표시된다', async ({ page }) => {
  await page.goto('/register')

  // 이름 입력
  await page.locator('#name').fill('테스트시니어')

  // 지역 선택 (Radix Select)
  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  // 희망 직종 선택
  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  // 경력 입력
  await page.locator('#career').fill('5')

  // 제출
  await page.getByRole('button', { name: '프로필 등록하기' }).click()

  // 성공 메시지 확인 (초록 박스)
  await expect(page.getByText(/등록이 완료되었습니다/)).toBeVisible({ timeout: 15_000 })

  // DB에서 방금 생성된 senior_id 조회 후 추천 페이지 이동
  const seniorId = await getSeniorId('테스트시니어')
  await page.goto(`/recommendations?senior_id=${seniorId}`)

  // 6점 배지 확인 (최상단)
  const badge = page.getByText('6점').first()
  await expect(badge).toBeVisible()
})
