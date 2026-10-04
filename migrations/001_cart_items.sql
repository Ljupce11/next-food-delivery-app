CREATE TABLE IF NOT EXISTS cart_items (
  user_id      uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  menu_item_id uuid        NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  quantity     integer     NOT NULL CHECK (quantity > 0),
  added_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, menu_item_id)
);

INSERT INTO cart_items (user_id, menu_item_id, quantity)
SELECT u.id, (item ->> 'id')::uuid, SUM((item ->> 'amount')::integer)
FROM users u
CROSS JOIN LATERAL json_array_elements(
  CASE WHEN json_typeof(u.cart) = 'array' THEN u.cart ELSE '[]'::json END
) AS restaurant
CROSS JOIN LATERAL json_array_elements(restaurant -> 'items') AS item
WHERE (item ->> 'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND (item ->> 'amount')::integer > 0
  AND EXISTS (SELECT 1 FROM menus m WHERE m.id = (item ->> 'id')::uuid)
GROUP BY u.id, (item ->> 'id')::uuid
ON CONFLICT (user_id, menu_item_id) DO NOTHING;
