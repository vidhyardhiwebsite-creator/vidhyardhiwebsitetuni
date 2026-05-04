-- ============================================================
-- COMPLETE SETUP - Run this ENTIRE file in Supabase SQL Editor
-- ============================================================

-- 1. CREATE ALL TABLES

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  category text not null,
  description text,
  images text[] default '{}',
  tags text[] default '{}',
  stock integer default 0,
  size text default 'Medium',
  created_at timestamptz default now()
);

create table if not exists cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_amount numeric not null,
  payment_status text default 'pending',
  address jsonb,
  razorpay_payment_id text,
  razorpay_order_id text,
  city text,
  state text,
  pincode text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id),
  quantity integer not null,
  price numeric not null
);

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

-- 2. ENABLE RLS ON ALL TABLES

alter table products enable row level security;
alter table cart enable row level security;
alter table wishlist enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table addresses enable row level security;

-- 3. DROP ALL OLD POLICIES (clean slate)

do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies
    where tablename in ('products','cart','wishlist','orders','order_items','addresses')
  loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

-- 4. PRODUCTS POLICIES

create policy "Anyone can read products"
  on products for select using (true);

create policy "Authenticated can insert products"
  on products for insert with check (auth.role() = 'authenticated');

create policy "Authenticated can update products"
  on products for update using (auth.role() = 'authenticated');

create policy "Authenticated can delete products"
  on products for delete using (auth.role() = 'authenticated');

-- 5. CART POLICIES

create policy "Users manage own cart select"
  on cart for select using (auth.uid() = user_id);

create policy "Users manage own cart insert"
  on cart for insert with check (auth.uid() = user_id);

create policy "Users manage own cart update"
  on cart for update using (auth.uid() = user_id);

create policy "Users manage own cart delete"
  on cart for delete using (auth.uid() = user_id);

-- 6. WISHLIST POLICIES

create policy "Users manage own wishlist select"
  on wishlist for select using (auth.uid() = user_id);

create policy "Users manage own wishlist insert"
  on wishlist for insert with check (auth.uid() = user_id);

create policy "Users manage own wishlist delete"
  on wishlist for delete using (auth.uid() = user_id);

-- 7. ORDERS POLICIES

create policy "Users manage own orders select"
  on orders for select using (auth.uid() = user_id);

create policy "Users manage own orders insert"
  on orders for insert with check (auth.uid() = user_id);

create policy "Users manage own orders update"
  on orders for update using (auth.uid() = user_id);

-- 8. ORDER ITEMS POLICIES

create policy "Users view own order items"
  on order_items for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

create policy "Users insert own order items"
  on order_items for insert with check (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- 9. ADDRESSES POLICIES

create policy "Users manage own addresses select"
  on addresses for select using (auth.uid() = user_id);

create policy "Users manage own addresses insert"
  on addresses for insert with check (auth.uid() = user_id);

create policy "Users manage own addresses update"
  on addresses for update using (auth.uid() = user_id);

create policy "Users manage own addresses delete"
  on addresses for delete using (auth.uid() = user_id);

-- 10. STORAGE BUCKET

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
  array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

do $$ declare r record; begin
  for r in select policyname from pg_policies where tablename = 'objects' and schemaname = 'storage'
    and policyname like '%product%'
  loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy "Public read product images"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "Auth upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Auth update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Auth delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
