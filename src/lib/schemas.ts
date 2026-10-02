import { z } from "zod";

export const signUpSchema = z.object({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
    .refine((value) => !/123|abc|password/i.test(value), {
      message:
        "Password must not contain easily guessable patterns like '123', 'abc', or 'password'",
    }),
});

/** Display-only text that may be missing in carts already stored in the database */
const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((value) => value ?? "");

const cartItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(200),
  extra: optionalText(500),
  price: z.coerce.number().nonnegative(),
  unitPrice: z.coerce.number().nonnegative(),
  amount: z.coerce.number().int().min(1).max(99),
  image: optionalText(500),
});

/**
 * Validates cart data coming from the client before it's stored.
 * Prices in the cart are display-only (and may arrive as strings, since Postgres
 * returns NUMERIC as text): checkout recalculates them from the database.
 */
export const cartSchema = z
  .array(
    z.object({
      restaurantId: z.string().uuid(),
      restaurantName: z.string().max(200),
      restaurantAddress: optionalText(300),
      image: optionalText(500),
      items: z.array(cartItemSchema).max(100),
    }),
  )
  .max(50);
