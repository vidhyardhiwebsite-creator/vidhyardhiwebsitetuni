-- =============================================
-- FIX RLS POLICIES - Run this in Supabase SQL Editor
-- =============================================

-- 1. PRODUCTS TABLE - allow authenticated users to insert/update/delete
-- Drop old restrictive policies first
drop policy if exists "Only admins can insert products" on products;
drop policy if exists "Only admins can update products" on products;
drop policy if exists "Only admins can delete products" on products;

-- Allow any authenticated user to manage products
create policy "Authenticated users can insert products"
  on products for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update products"
  on products for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete products" 
  on products for delete
  using (auth.role() = 'authenticated');

-- 2. STORAGE - fix bucket policies
-- Drop old policies
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;
drop policy if exists "Public read product images" on storage.objects;

-- Public read for product images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Authenticated users can upload
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Authenticated users can update
create policy "Authenticated users can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Authenticated users can delete
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- 3. Make sure the bucket exists and is public
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880;

-- =============================================
-- FIX CART RLS + ADD ADDRESSES TABLE
-- =============================================

-- Fix cart RLS (drop old, add correct)
drop policy if exists "Users can view own cart" on cart;
drop policy if exists "Users can insert own cart" on cart;
drop policy if exists "Users can update own cart" on cart;
drop policy if exists "Users can delete own cart" on cart;

create policy "Users can view own cart" on cart
  for select using (auth.uid() = user_id);
create policy "Users can insert own cart" on cart
  for insert with check (auth.uid() = user_id);
create policy "Users can update own cart" on cart
  for update using (auth.uid() = user_id);
create policy "Users can delete own cart" on cart
  for delete using (auth.uid() = user_id);

-- Fix orders RLS
drop policy if exists "Users can view own orders" on orders;
drop policy if exists "Users can insert own orders" on orders;
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders
  for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on orders
  for update using (auth.uid() = user_id);

-- Fix order_items RLS
drop policy if exists "Users can view own order items" on order_items;
drop policy if exists "Users can insert order items" on order_items;
drop policy if exists "Admins can view all order items" on order_items;

create policy "Users can view own order items" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );
create policy "Users can insert order items" on order_items
  for insert with check (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- Fix wishlist RLS
drop policy if exists "Users can view own wishlist" on wishlist;
drop policy if exists "Users can insert own wishlist" on wishlist;
drop policy if exists "Users can delete own wishlist" on wishlist;

create policy "Users can view own wishlist" on wishlist
  for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on wishlist
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on wishlist
  for delete using (auth.uid() = user_id);

-- ADDRESSES TABLE
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  address1 text not null,
  address2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

alter table addresses enable row level security;

create policy "Users can view own addresses" on addresses
  for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on addresses
  for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on addresses
  for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on addresses
  for delete using (auth.uid() = user_id);
