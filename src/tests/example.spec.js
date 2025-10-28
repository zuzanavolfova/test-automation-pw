import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
  await page.goto("/prihlaseni");
  await page.locator("input#email").screenshot({ path: "login-email.png" });
  await page.locator(".btn-primary").screenshot({ path: "btn-primary.png" });
  await page
    .locator("div")
    .locator("form")
    .locator("input[type$='word']")
    .screenshot({ path: "combine.png" });
  console.log(await page.title());
});
