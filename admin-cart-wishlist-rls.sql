-- Run this in your Supabase SQL editor
-- Allows admins to read all users' cart and wishlist items

-- Admin can read all cart rows
create policy "Admins can view all carts"
  on cart for select
  using (
    auth.uid() = user_id
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Admin can read all wishlist rows
create policy "Admins can view all wishlists"
  on wishlist for select
  using (
    auth.uid() = user_id
    OR auth.jwt() ->> 'role' = 'admin'
  );
