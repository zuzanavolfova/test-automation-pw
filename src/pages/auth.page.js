import { test, expect } from "@playwright/test";
import { config } from "dotenv";

config();
const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

export class AuthPage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path) {
    await this.page.goto(path);
  }

  async fillForm(fields) {
    for (const [selector, value] of Object.entries(fields)) {
      await this.page.locator(selector).fill(value);
    }
  }

  async submitForm(buttonName) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async getAlert() {
    return this.page.getByRole("alert");
  }
}

class LoginPage extends AuthPage {
  async login(email, password) {
    await this.navigateTo("/prihlaseni");
    await this.page.getByLabel("email").fill(email);
    await this.page.getByLabel("Heslo").fill(password);
    await this.submitForm("Přihlásit");
  }

  async logout() {
    const userName = this.page.locator(".navbar-right").locator("strong");
    await userName.click();

    const logoutButton = this.page.getByRole("link", { name: "Odhlásit" });
    await logoutButton.waitFor();
    await logoutButton.click();
  }

  async isLoginVisible() {
    return this.page.getByRole("link", { name: "Přihlásit" }).isVisible();
  }
}

class RegistrationPage extends AuthPage {
  async register(userData) {
    await this.navigateTo("/registrace");
    await this.fillForm({
      'input[name="name"]': userData.name,
      'input[name="email"]': userData.email,
      'input[name="password"]': userData.password,
      'input[name="password_confirmation"]': userData.repeatedPassword,
    });
    await this.submitForm("Zaregistrovat");
  }
}

class TestDataGenerator {
  static generateUniqueEmail(prefix = "zuzka.volfova") {
    return `${prefix}${Date.now()}@email.cz`;
  }

  static generateUniqueName(baseName = "Zuzka Volfova") {
    return `${baseName} ${Date.now()}`;
  }
}

class RegistrationTestCase {
  constructor(name, getUserData, expectedError = null) {
    this.name = name;
    this.getUserData = getUserData;
    this.expectedError = expectedError;
  }

  shouldShowAlert() {
    return this.expectedError !== null;
  }

  async execute(page) {
    const registrationPage = new RegistrationPage(page);
    const userData = this.getUserData();
    await registrationPage.register(userData);
    return registrationPage.getAlert();
  }

  async verify(alert) {
    if (this.shouldShowAlert()) {
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(this.expectedError);
    } else {
      await expect(alert).not.toBeVisible();
    }
  }
}

const registrationTestCases = [
  new RegistrationTestCase("validní registrace", () => ({
    name: TestDataGenerator.generateUniqueName(),
    email: TestDataGenerator.generateUniqueEmail(),
    password: "Czechitas123",
    repeatedPassword: "Czechitas123",
  })),
  new RegistrationTestCase(
    "uživatel již existuje",
    () => ({
      name: "Zuzka Volfova",
      email: "zuzka.helesicova@email.cz",
      password: "Czechitas123",
      repeatedPassword: "Czechitas123",
    }),
    "Účet s tímto emailem již existuje"
  ),
  new RegistrationTestCase(
    "slabé heslo",
    () => ({
      name: TestDataGenerator.generateUniqueName(),
      email: TestDataGenerator.generateUniqueEmail(),
      password: "12345678",
      repeatedPassword: "12345678",
    }),
    "Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici"
  ),
];

test.describe("Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/registrace");
  });

  for (const testCase of registrationTestCases) {
    test(`registrace - ${testCase.name}`, async ({ page }) => {
      const alert = await testCase.execute(page);
      await testCase.verify(alert);
    });
  }
});

test.describe("LogIn", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prihlaseni");
  });

  test("přihlášení a odhlášení", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await loginPage.logout();

    await expect(page.getByRole("link", { name: "Přihlásit" })).toBeVisible();
  });
});
