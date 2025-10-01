import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log(await page.title());
});