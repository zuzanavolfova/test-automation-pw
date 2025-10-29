import { test, expect } from "@playwright/test";

test("logIn-logOut", async ({ page }) => {
  await page.goto("/prihlaseni");
  const emailField = page.getByLabel("email");
  const passwordField = page.getByLabel("Heslo");
  const loginButton = page.getByRole("button", { name: "Přihlásit" });

  await emailField.fill("zuzka.helesicova@email.cz");
  await passwordField.fill("Czechitas123");
  await loginButton.click();

  const userName = page.locator(".navbar-right").locator("strong");
  await userName.click();

  const logoutButton = page.getByRole("link", { name: "Odhlásit" });
  await logoutButton.waitFor();
  await logoutButton.click();

  await expect(page.getByRole("link", { name: "Přihlásit" })).toBeVisible();
});
