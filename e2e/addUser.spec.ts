import { test, expect } from '@playwright/test';

test('форма должна открываться, отправляться и пользователь отображается в таблице', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/api/auth/callback/nodemailer?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=bcc54933cba5b8d0cdd846acc8562ff22e5ee2419e3689529623e78b186cf826&email=dan%40example.com'
  );

  
  await page.getByRole('link', { name: 'Пользователи' }).click();
  await page.waitForURL('**/user');
  
  const toggle = page.locator('details.collapse summary');
  await expect(toggle).toBeVisible();
  await toggle.click();
  
  const email = 'testirovanie10@example.com';
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="firstname"]').fill('Сергей');
  await page.locator('input[name="surname"]').fill('Сергеев');
  await page.getByRole('button', { name: 'Добавить' }).click();

  const lastPageLink = page.locator('a').filter({ hasText: /^\d+$/ }).last();
  await lastPageLink.click();

  await page.waitForLoadState('networkidle');

  await expect(page.locator('table')).toContainText(email);
});
