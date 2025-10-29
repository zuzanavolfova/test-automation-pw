import { test, expect } from "@playwright/test";

test("homework", async ({ page }) => {
  await page.goto("/registrace");
  const name = await page.locator("input#name");
  name.screenshot({ path: "input-name.png" });
  await name.fill("test");
  const email = await page.locator("input#email");
  email.screenshot({ path: "input-email.png" });
  await email.fill("test@test.com");
  const password = await page.locator("input#password");
  password.screenshot({ path: "input-password.png" });
  await password.fill("testpassword");
  const passwordConfirm = await page.locator("input#password-confirm");
  passwordConfirm.screenshot({ path: "input-password-confirm.png" });
  await passwordConfirm.fill("testpassword");
  const submitButton = await page.locator("button[type='submit']");
  submitButton.screenshot({ path: "button.png" });
  await submitButton.click();
});

test("homework2", async ({ page }) => {
  await page.goto("/prihlaseni");
  const headingLocator = await page.getByRole("heading", { level: 1 });
  const headingText = await headingLocator.textContent();
  console.log(headingText);
  const emailField = page.getByLabel("email");

  const passwordField = page.getByLabel("Heslo");
  console.log("Is visible: " + (await passwordField.isVisible()));
  console.log("Is enabled: " + (await passwordField.isEnabled()));

  const loginButton = page.getByRole("button", { name: "Přihlásit" });
  const buttonText = await loginButton.textContent();
  console.log("Text: " + buttonText);

  await emailField.fill("da-app.admin@czechitas.cz");
  await passwordField.fill("Czechitas123");
  await loginButton.click();
});
