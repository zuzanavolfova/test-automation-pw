import { test, expect } from "@playwright/test";

test.describe("Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/registrace");
  });

  test("registrace - validni registrace", async ({ page }) => {
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

  test("registrace - uzivatel již existuje", async ({ page }) => {
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

  test("registrace - spatne heslo", async ({ page }) => {
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
});

test.describe("LogIn", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prihlaseni");
  });
  test("logIn-logOut", async ({ page }) => {
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
});
