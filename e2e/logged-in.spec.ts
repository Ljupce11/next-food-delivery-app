import { expect, type Page, type Response, test } from "@playwright/test";

test.skip(
  !process.env.E2E_EMAIL || !process.env.E2E_PASSWORD,
  "Set E2E_EMAIL and E2E_PASSWORD to run the logged-in tests",
);

function waitForServerActions(page: Page, count: number) {
  let seen = 0;
  return new Promise<void>((resolve) => {
    const onResponse = (response: Response) => {
      if (!response.request().headers()["next-action"]) return;
      seen += 1;
      if (seen === count) {
        page.off("response", onResponse);
        resolve();
      }
    };
    page.on("response", onResponse);
  });
}

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

test("the quantity chosen in the item modal is added to the cart", async ({
  page,
}) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== "1",
    "Changes the test account's cart: set E2E_ALLOW_WRITES=1 to run it",
  );

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

  const drawer = page.getByRole("dialog");
  const cartQuantity = drawer.getByRole("button", {
    name: new RegExp(`^${itemName} quantity: \\d+$`),
  });
  const readCartQuantity = async () => {
    await page.getByRole("button", { name: "Cart", exact: true }).click();
    await expect(drawer.getByText("Your items")).toBeVisible();
    const tab = drawer.getByRole("tab", { name: restaurantName });
    let quantity = 0;
    if (await tab.count()) {
      await tab.click();
      if (await cartQuantity.count()) {
        quantity = Number((await cartQuantity.innerText()).trim());
      }
    }
    return quantity;
  };

  const before = await readCartQuantity();
  await page.keyboard.press("Escape");
  await expect(page.locator(".cart-drawer")).toHaveCount(0);

  await firstItem.click();
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: "Increase quantity" }).click();
  await modal.getByRole("button", { name: "Increase quantity" }).click();
  await expect(
    modal.getByRole("button", { name: "Quantity: 3" }),
  ).toBeVisible();
  await modal.getByRole("button", { name: "Add to cart" }).click();
  await expect(modal).toBeHidden();

  await firstItem.click();
  await expect(
    modal.getByRole("button", { name: "Quantity: 1" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();

  expect(await readCartQuantity()).toBe(before + 3);

  if (before === 0) {
    const removed = waitForServerActions(page, 1);
    await drawer.getByRole("button", { name: `Remove ${itemName}` }).click();
    await removed;
  } else {
    const restored = waitForServerActions(page, 3);
    for (let i = 0; i < 3; i++) {
      await drawer
        .getByRole("button", { name: `Decrease ${itemName} quantity` })
        .click();
    }
    await expect(cartQuantity).toHaveText(String(before));
    await restored;
  }
});

test("quick quantity changes are all saved", async ({ page }) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== "1",
    "Changes the test account's cart: set E2E_ALLOW_WRITES=1 to run it",
  );

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
    await page.reload();
    await openCart();
    return Number((await quantity().innerText()).trim());
  };

  await openCart();
  const before = Number((await quantity().innerText()).trim());

  const increase = page.getByRole("button", {
    name: `Increase ${itemName} quantity`,
  });
  const increaseDone = waitForServerActions(page, 2);
  await increase.click();
  await increase.click();
  await increaseDone;
  await expect(quantity()).toHaveText(String(before + 2));
  expect(await savedQuantityAfterReload()).toBe(before + 2);

  const decrease = page.getByRole("button", {
    name: `Decrease ${itemName} quantity`,
  });
  const decreaseDone = waitForServerActions(page, 2);
  await decrease.click();
  await decrease.click();
  await decreaseDone;
  await expect(quantity()).toHaveText(String(before));
  expect(await savedQuantityAfterReload()).toBe(before);
});

test("add to cart, check out and complete an order", async ({ page }) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== "1",
    "Creates a real order: set E2E_ALLOW_WRITES=1 to run it",
  );

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

  const expectedTotal = await drawerTotal(page);
  await drawer.getByRole("button", { name: "Go to checkout" }).click();
  await expect(drawer).toBeHidden();

  await page.goto("/orders");
  const newestOrder = page
    .getByRole("grid", { name: "Orders table" })
    .getByRole("row")
    .nth(1);
  await expect(newestOrder).toContainText(restaurantName);
  await expect(newestOrder).toContainText(expectedTotal);
  await expect(newestOrder).toContainText("In Progress");

  await newestOrder
    .getByRole("button", { name: "View more information" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(itemName);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close" })
    .first()
    .click();

  await newestOrder.getByRole("button", { name: "Complete order" }).click();
  await expect(newestOrder).toContainText("Delivered");
});
