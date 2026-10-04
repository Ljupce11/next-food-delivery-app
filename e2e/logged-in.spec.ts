import { expect, type Page, test } from "@playwright/test";

test.skip(
  !process.env.E2E_EMAIL || !process.env.E2E_PASSWORD,
  "Set E2E_EMAIL and E2E_PASSWORD to run the logged-in tests",
);

/** The "123kr" amount next to the drawer's "Total:" label */
async function drawerTotal(page: Page) {
  const total = page
    .getByRole("dialog")
    .locator("p", { hasText: /^Total:$/ })
    .locator("xpath=following-sibling::p");
  return (await total.innerText()).trim();
}

test("orders page is accessible", async ({ page }) => {
  await page.goto("/orders");
  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Your orders" }),
  ).toBeVisible();
  await expect(page.getByRole("grid", { name: "Orders table" })).toBeVisible();
});

test("quick quantity changes are all saved", async ({ page }) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== "1",
    "Changes the test account's cart: set E2E_ALLOW_WRITES=1 to run it",
  );

  // Make sure the cart has an item from the first restaurant
  // Open the restaurant page directly: clicking the link on a scrolled home page
  // can leave the hide-on-scroll navbar hidden (separate, pre-existing issue)
  await page.goto("/");
  const restaurantHref = await page
    .locator('a[href^="/restaurant/"]')
    .first()
    .getAttribute("href");
  await page.goto(restaurantHref ?? "/");
  await expect(
    page.getByText("Open now").filter({ visible: true }),
  ).toBeVisible();
  const restaurantName = (
    await page.getByRole("heading", { level: 1 }).innerText()
  ).trim();
  const firstItem = page
    .getByRole("button")
    .filter({ hasText: /\d+kr/ })
    .first();
  const itemName = (await firstItem.locator("b").innerText()).trim();
  await firstItem.click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  const openCart = async () => {
    await page.getByRole("button", { name: "Cart", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("tab", { name: restaurantName })
      .click();
  };
  const quantity = () =>
    page.getByRole("dialog").getByRole("button", {
      name: new RegExp(`^${itemName} quantity: \\d+$`),
    });
  const savedQuantityAfterReload = async () => {
    await page.waitForLoadState("networkidle"); // let the server actions finish
    await page.reload();
    // The navbar hides on scroll, and a reload restores the scroll position
    await page.evaluate(() => window.scrollTo(0, 0));
    await openCart();
    return Number((await quantity().innerText()).trim());
  };

  await openCart();
  const before = Number((await quantity().innerText()).trim());

  // Two quick clicks: the UI updates immediately (optimistic) …
  const increase = page.getByRole("button", {
    name: `Increase ${itemName} quantity`,
  });
  await increase.click();
  await increase.click();
  await expect(quantity()).toHaveText(String(before + 2));
  // … and both changes reach the database (no lost update)
  expect(await savedQuantityAfterReload()).toBe(before + 2);

  // Put it back
  const decrease = page.getByRole("button", {
    name: `Decrease ${itemName} quantity`,
  });
  await decrease.click();
  await decrease.click();
  await expect(quantity()).toHaveText(String(before));
  expect(await savedQuantityAfterReload()).toBe(before);
});

test("add to cart, check out and complete an order", async ({ page }) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== "1",
    "Creates a real order: set E2E_ALLOW_WRITES=1 to run it",
  );

  // Open the first restaurant and add its first menu item
  // Open the restaurant page directly: clicking the link on a scrolled home page
  // can leave the hide-on-scroll navbar hidden (separate, pre-existing issue)
  await page.goto("/");
  const restaurantHref = await page
    .locator('a[href^="/restaurant/"]')
    .first()
    .getAttribute("href");
  await page.goto(restaurantHref ?? "/");
  await expect(
    page.getByText("Open now").filter({ visible: true }),
  ).toBeVisible();
  const restaurantName = (
    await page.getByRole("heading", { level: 1 }).innerText()
  ).trim();

  const firstItem = page
    .getByRole("button")
    .filter({ hasText: /\d+kr/ })
    .first();
  const itemName = (await firstItem.locator("b").innerText()).trim();
  await firstItem.click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  // Open the cart on that restaurant's tab and add one more of the item
  await page.getByRole("button", { name: "Cart" }).click();
  const drawer = page.getByRole("dialog");
  await drawer.getByRole("tab", { name: restaurantName }).click();
  const quantity = drawer.getByRole("button", {
    name: new RegExp(`^${itemName} quantity: \\d+$`),
  });
  const before = Number((await quantity.innerText()).trim());
  await drawer
    .getByRole("button", { name: `Increase ${itemName} quantity` })
    .click();
  await expect(quantity).toHaveText(String(before + 1));

  // The total the server calculates must match what the cart showed
  const expectedTotal = await drawerTotal(page);
  await drawer.getByRole("button", { name: "Go to checkout" }).click();
  await expect(drawer).toBeHidden();

  // Newest order first
  await page.goto("/orders");
  const newestOrder = page
    .getByRole("grid", { name: "Orders table" })
    .getByRole("row")
    .nth(1);
  await expect(newestOrder).toContainText(restaurantName);
  await expect(newestOrder).toContainText(expectedTotal);
  await expect(newestOrder).toContainText("In Progress");

  // Order details show the item
  await newestOrder
    .getByRole("button", { name: "View more information" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(itemName);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close" })
    .first()
    .click();

  // Complete it
  await newestOrder.getByRole("button", { name: "Complete order" }).click();
  await expect(newestOrder).toContainText("Delivered");
});
