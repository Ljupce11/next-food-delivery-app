import { expect, type Page, test } from "@playwright/test";
import { trackConsole, visitAndScroll } from "./console";

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

test("typing in the search box filters the restaurants", async ({ page }) => {
  await page.goto("/");
  const searchBox = page.getByRole("textbox", {
    name: "Search restaurants",
  });
  const restaurantLinks = page.locator('a[href^="/restaurant/"]');
  await expect(restaurantLinks.first()).toBeVisible();

  await searchBox.fill("no-restaurant-has-this-name");
  await expect(page).toHaveURL(/\?search=no-restaurant-has-this-name/);
  await expect(page.getByText("No restaurants found")).toBeVisible();

  await page.getByRole("button", { name: "clear input" }).click();
  await expect(page).not.toHaveURL(/search=/);
  await expect(searchBox).toHaveValue("");
  await expect(restaurantLinks.first()).toBeVisible();
});

test("restaurant page renders on the server without errors", async ({
  page,
  request,
}) => {
  const path = await firstRestaurantPath(page);

  const html = await (await request.get(path)).text();
  expect(
    html.includes("<!--$!-->"),
    "no Suspense boundary should fall back to client rendering",
  ).toBe(false);

  const messages = trackConsole(page);
  await page.goto(path);
  await expect(
    page.getByRole("heading", { level: 1 }).filter({ visible: true }),
  ).toBeVisible();
  await expect(page.getByText(/\d+kr/).first()).toBeVisible();
  expect(messages).toEqual([]);
});

test("sign-up shows server-side validation errors", async ({ page }) => {
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
  await expect(page.getByLabel("First name")).toHaveValue("Validation");
  await expect(page.getByLabel("Email")).toHaveValue(
    "validation-test@example.com",
  );
  await expect(page.getByLabel("Password")).toHaveValue("lowercase");
});

test("a failed login keeps the entered values", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password").fill("WrongPassword1!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Invalid credentials.")).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue("nobody@example.com");
  await expect(page.getByLabel("Password")).toHaveValue("WrongPassword1!");
});

test.describe("unknown restaurants show a not-found page", () => {
  for (const id of ["not-a-real-id", "00000000-0000-0000-0000-000000000000"]) {
    test(id, async ({ page }) => {
      await page.goto(`/restaurant/${id}`);
      await expect(
        page.getByRole("heading", { name: "Restaurant not found" }),
      ).toBeVisible();
      await page.getByText("Back to restaurants").click();
      await expect(page).toHaveURL(/\/$/);
    });
  }
});

test("adding to cart while logged out goes to the login page", async ({
  page,
}) => {
  const path = await firstRestaurantPath(page);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.getByRole("button").filter({ hasText: /\d+kr/ }).first().click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
});

test("category tabs filter the menu and are kept in the URL", async ({
  page,
}) => {
  const path = await firstRestaurantPath(page);
  await page.goto(path);
  const tabs = page
    .getByRole("tablist", { name: "Menu categories" })
    .getByRole("tab");
  const items = page.getByRole("button").filter({ hasText: /\d+kr/ });
  await expect(tabs.first()).toHaveText("Show all");
  await expect(items.first()).toBeVisible();
  const allCount = await items.count();

  const category = tabs.nth(1);
  await page.waitForLoadState("networkidle");
  await category.click();
  await expect(page).toHaveURL(/\?category=[a-z]+$/);
  await expect(category).toHaveAttribute("aria-selected", "true");
  await expect.poll(() => items.count()).toBeLessThan(allCount);

  await page.reload();
  await expect(category).toHaveAttribute("aria-selected", "true");

  await tabs.first().click();
  await expect(page).not.toHaveURL(/category=/);
  await expect.poll(() => items.count()).toBe(allCount);
});

test.describe("public pages log no console warnings or errors", () => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const restaurantPath = await firstRestaurantPath(page);
      const messages = trackConsole(page);
      for (const path of ["/", restaurantPath, "/login", "/sign-up"]) {
        await visitAndScroll(page, path);
      }
      await visitAndScroll(page, restaurantPath);
      await page
        .getByRole("button")
        .filter({ hasText: /\d+kr/ })
        .first()
        .click();
      await expect(
        page.getByRole("dialog").getByText("on Pixabay"),
      ).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(messages).toEqual([]);
    });
  }
});
