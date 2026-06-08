import { test, expect } from '@playwright/test';

test.describe('Preheat Workflow', () => {
  // Use a clean slate for storage
  test.use({ storageState: { cookies: [], origins: [] } });

  test('complete workflow: onboarding to dashboard', async ({ page }) => {
    // 1. Welcome Screen
    await page.goto('/');
    
    await expect(page.getByText('What should we call you?')).toBeVisible();
    await page.getByPlaceholder('e.g. John Doe').fill('Test User');
    await page.getByRole('button', { name: 'Continue' }).click();

    // 2. Create Project
    await expect(page.getByText('What are you working on next?')).toBeVisible();
    await page.getByPlaceholder('e.g. Website Redesign').fill('Test Project');
    await page.getByRole('button', { name: 'Create Project' }).click();

    // 3. Dashboard
    // Wait for dashboard to load
    await expect(page.getByText('Hi, Test User')).toBeVisible();
    await expect(page.getByText('Test Project')).toBeVisible();

    // Close Tutorial Dialog
    await expect(page.getByText('Welcome to Preheat')).toBeVisible();
    await page.getByRole('button', { name: '✕' }).click();

    // Type in editor
    // Editor uses tiptap contenteditable
    const editor = page.locator('.tiptap');
    await expect(editor).toBeVisible();
    await editor.click();
    await editor.fill('Writing some plan content...');
    await expect(editor).toContainText('Writing some plan content...');

    // Add plan
    await page.getByRole('button', { name: '+ New Plan' }).click();
    
    // There should be a new 'Untitled' plan in sidebar
    await expect(page.getByText('Untitled', { exact: true })).toHaveCount(2);

    // Add another project so we can delete one
    await page.getByRole('button', { name: '+ New Project' }).click();
    await expect(page.getByText('New Project', { exact: true })).toBeVisible();

    // Now delete 'Test Project'
    const testProjectRow = page.locator('div.group').filter({ hasText: /^Test Project/ }).first();
    await testProjectRow.hover();
    const deleteProjectBtn = testProjectRow.locator('button[title="Delete Project"]');
    await deleteProjectBtn.click();
    
    // Dialog shows up
    await expect(page.getByText('Are you sure you want to delete this project? This action cannot be undone.')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // The project should be removed from the sidebar
    await expect(page.getByText('Test Project')).not.toBeVisible();
    await expect(page.getByText('New Project', { exact: true })).toBeVisible();
  });
});
