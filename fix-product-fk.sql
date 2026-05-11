-- Fix: Allow products to be deleted even if they exist in order_items
-- Changes the FK from RESTRICT (default) to SET NULL
-- This preserves order history — order items will show NULL product_id after deletion

ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE SET NULL;
