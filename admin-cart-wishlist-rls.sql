-- Run this in your Supabase SQL editor
-- This creates security definer functions that bypass RLS for admin use

-- Drop old broken policies
drop policy if exists "Admins can view all carts" on cart;
drop policy if exists "Admins can view all wishlists" on wishlist;
drop policy if exists "Users can view own cart" on cart;
drop policy if exists "Users can view own wishlist" on wishlist;

-- Simple policies: users see their own rows only
create policy "Users can view own cart"
  on cart for select using (auth.uid() = user_id);

create policy "Users can view own wishlist"
  on wishlist for select using (auth.uid() = user_id);

-- Function to get ALL cart items (bypasses RLS via security definer)
create or replace function get_all_carts()
returns table (
  id uuid,
  user_id uuid,
  product_id uuid,
  quantity integer,
  created_at timestamptz,
  product_name text,
  product_price numeric,
  product_images text[],
  product_category text,
  product_custom_id text
)
language sql
security definer
set search_path = public
as $$
  select
    c.id,
    c.user_id,
    c.product_id,
    c.quantity,
    c.created_at,
    p.name as product_name,
    p.price as product_price,
    p.images as product_images,
    p.category as product_category,
    p.custom_id as product_custom_id
  from cart c
  left join products p on p.id = c.product_id;
$$;

-- Function to get ALL wishlist items (bypasses RLS via security definer)
create or replace function get_all_wishlists()
returns table (
  id uuid,
  user_id uuid,
  product_id uuid,
  created_at timestamptz,
  product_name text,
  product_price numeric,
  product_images text[],
  product_category text,
  product_custom_id text
)
language sql
security definer
set search_path = public
as $$
  select
    w.id,
    w.user_id,
    w.product_id,
    w.created_at,
    p.name as product_name,
    p.price as product_price,
    p.images as product_images,
    p.category as product_category,
    p.custom_id as product_custom_id
  from wishlist w
  left join products p on p.id = w.product_id;
$$;

-- Grant execute to authenticated users (admin check is done in the app)
grant execute on function get_all_carts() to authenticated;
grant execute on function get_all_wishlists() to authenticated;
