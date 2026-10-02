import { type Page, expect, test } from "@playwright/test";

/** Collects uncaught errors and console errors for the lifetime of the page */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function firstRestaurantPath(page: Page) {
  await page.goto("/");
  const href = await page
    .locator('a[href^="/restaurant/"]')
    .first()
    .getAttribute("href");
  expect(href, "home page should link to at least one restaurant").toBeTruthy();
  return href as string;
}

test.describe("private pages redirect to login when logged out", () => {
  for (const path of ["/orders", "/profile", "/favorites"]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login\?callbackUrl=/);
      await expect(
        page.getByRole("heading", { name: "Sign in to your account" }),
      ).toBeVisible();
    });
  }
});

test("home page lists restaurants", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Restaurants" }),
  ).toBeVisible();
  await expect(page.locator('a[href^="/restaurant/"]').first()).toBeVisible();
});

test("search with no matches shows an empty state", async ({ page }) => {
  await page.goto("/?search=no-restaurant-has-this-name");
  await expect(page.getByText("No restaurants found")).toBeVisible();
});

test("restaurant page renders on the server without errors", async ({
  page,
  request,
}) => {
  const path = await firstRestaurantPath(page);

  // Regression test: a client component reading `window` during render made
  // server rendering fail, and React fell back to client rendering (<!--$!-->)
  const html = await (await request.get(path)).text();
  expect(
    html.includes("<!--$!-->"),
    "no Suspense boundary should fall back to client rendering",
  ).toBe(false);

  const errors = trackErrors(page);
  await page.goto(path);
  await expect(page.getByText("Open now")).toBeVisible();
  await expect(page.getByText(/\d+kr/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("sign-up shows server-side validation errors", async ({ page }) => {
  // Passes the browser's own checks but fails the server's Zod schema,
  // so nothing is written to the database
  await page.goto("/sign-up");
  await page.getByLabel("First name").fill("Validation");
  await page.getByLabel("Last name").fill("Test");
  await page.getByLabel("Email").fill("validation-test@example.com");
  await page.getByLabel("Password").fill("lowercase");
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page.getByLabel("Password")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.getByText(/^Password must /)).toBeVisible();
  await expect(page).toHaveURL(/\/sign-up$/);
});
