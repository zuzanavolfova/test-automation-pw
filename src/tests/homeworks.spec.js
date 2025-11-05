import { test, expect } from "@playwright/test";
import { config } from "dotenv";

config();
const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

async function login(page, email, password) {
  await page.goto("/prihlaseni");
  await page.getByLabel("email").fill(email);
  await page.getByLabel("Heslo").fill(password);
  await page.getByRole("button", { name: "Přihlásit" }).click();
}

async function registrace(page, name, email, password, repeatedPassword) {
  await page.goto("/registrace");
  await page.locator('input[name="name"]').fill(name);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page
    .locator('input[name="password_confirmation"]')
    .fill(repeatedPassword);
  await page.getByRole("button", { name: "Zaregistrovat" }).click();
}

function generateUniqueEmail(prefix = "zuzka.volfova") {
  return `${prefix}${Date.now()}@email.cz`;
}

function generateUniqueName(baseName = "Zuzka Volfova") {
  return `${baseName} ${Date.now()}`;
}

const registrationTestCases = [
  {
    name: "validní registrace",
    userData: {
      getName: () => generateUniqueName(),
      getEmail: () => generateUniqueEmail(),
      password: "Czechitas123",
      repeatedPassword: "Czechitas123",
    },
    expectedError: null,
    shouldShowAlert: false,
  },
  {
    name: "uživatel již existuje",
    userData: {
      getName: () => "Zuzka Volfova",
      getEmail: () => "zuzka.helesicova@email.cz",
      password: "Czechitas123",
      repeatedPassword: "Czechitas123",
    },
    expectedError: "Účet s tímto emailem již existuje",
    shouldShowAlert: true,
  },
  {
    name: "slabé heslo",
    userData: {
      getName: () => generateUniqueName(),
      getEmail: () => generateUniqueEmail(),
      password: "12345678",
      repeatedPassword: "12345678",
    },
    expectedError:
      "Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici",
    shouldShowAlert: true,
  },
];

test.describe("Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/registrace");
  });

  for (const testCase of registrationTestCases) {
    test(`registrace - ${testCase.name}`, async ({ page }) => {
      const { getName, getEmail, password, repeatedPassword } =
        testCase.userData;

      await registrace(page, getName(), getEmail(), password, repeatedPassword);

      const alert = page.getByRole("alert");

      if (testCase.shouldShowAlert) {
        await expect(alert).toBeVisible();
        await expect(alert).toContainText(testCase.expectedError);
      } else {
        await expect(alert).not.toBeVisible();
      }
    });
  }
});

test.describe("LogIn", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prihlaseni");
  });

  test("přihlášení a odhlášení", async ({ page }) => {
    await login(page, ADMIN_USERNAME, ADMIN_PASSWORD);

    const userName = page.locator(".navbar-right").locator("strong");
    await userName.click();

    const logoutButton = page.getByRole("link", { name: "Odhlásit" });
    await logoutButton.waitFor();
    await logoutButton.click();

    await expect(page.getByRole("link", { name: "Přihlásit" })).toBeVisible();
  });
});
