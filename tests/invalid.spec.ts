import { test, expect } from '@playwright/test'
import { resetDb, db } from './helpers'

test.beforeEach(async () => {
  await resetDb()
})

test('실패 시나리오: 이름 미입력 시 빨간 안내 박스가 뜨고 DB에 레코드가 추가되지 않는다', async ({
  page,
}) => {
  await page.goto('/register')

  // 이름은 비워둔 채 나머지만 입력
  await page.getByRole('combobox').nth(0).click()
  await page.getByRole('option', { name: '서울' }).click()

  await page.getByRole('combobox').nth(1).click()
  await page.getByRole('option', { name: '경비' }).click()

  await page.locator('#career').fill('3')

  // 제출
  await page.getByRole('button', { name: '프로필 등록하기' }).click()

  // 이름 필드 빨간 안내 박스 표시 확인
  await expect(page.getByText(/이름을 입력해 주세요/)).toBeVisible()

  // seniors 테이블에 새 레코드가 없음을 확인
  const { data: seniors } = await db.from('seniors').select('id').gte('created_at', '2000-01-01')
  expect(seniors?.length ?? 0).toBe(0)
})
