import { test, expect } from "@playwright/test";

test("homework4.1", async ({ page }) => {
  await page.goto("/registrace");
  const nameField = page.locator('input[name="name"]');
  await nameField.fill("Zuzka Volfova " + Date.now());
  const emailField = page.locator('input[name="email"]');
  await emailField.fill("zuzka.volfova" + Date.now() + "@email.cz");
  const passwordField = page.locator('input[name="password"]');
  await passwordField.fill("Czechitas123");
  const passwordConfirmField = page.locator(
    'input[name="password_confirmation"]'
  );
  await passwordConfirmField.fill("Czechitas123");
  const loginButton = page.getByRole("button", { name: "Zaregistrovat" });
  await loginButton.click();
  await expect(page.getByRole("alert")).not.toBeVisible();
});

test("homework4.2", async ({ page }) => {
  await page.goto("/registrace");
  const nameField = page.locator('input[name="name"]');
  await nameField.fill("Zuzka Volfova");
  const emailField = page.locator('input[name="email"]');
  await emailField.fill("zuzka.helesicova@email.cz");
  const passwordField = page.locator('input[name="password"]');
  await passwordField.fill("Czechitas123");
  const passwordConfirmField = page.locator(
    'input[name="password_confirmation"]'
  );
  await passwordConfirmField.fill("Czechitas123");
  const loginButton = page.getByRole("button", { name: "Zaregistrovat" });
  await loginButton.click();
  await expect(page.getByRole("alert")).toContainText(
    "Účet s tímto emailem již existuje"
  );
});

test("homework4.3", async ({ page }) => {
  await page.goto("/registrace");
  const nameField = page.locator('input[name="name"]');
  await nameField.fill("Zuzka Volfova " + Date.now());
  const emailField = page.locator('input[name="email"]');
  await emailField.fill("zuzka.volfova" + Date.now() + "@email.cz");
  const passwordField = page.locator('input[name="password"]');
  await passwordField.fill("12345678");
  const passwordConfirmField = page.locator(
    'input[name="password_confirmation"]'
  );
  await passwordConfirmField.fill("12345678");
  const loginButton = page.getByRole("button", { name: "Zaregistrovat" });
  await loginButton.click();
  await expect(page.getByRole("alert")).toContainText(
    "Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici"
  );
});
