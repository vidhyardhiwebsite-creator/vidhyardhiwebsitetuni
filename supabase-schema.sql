-- Run this in your Supabase SQL editor

-- Products table
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

-- Cart table
create table if not exists cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total_amount numeric not null,
  payment_status text default 'pending',
  address text,
  razorpay_payment_id text,
  razorpay_order_id text,
  created_at timestamptz default now()
);

-- Order items table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  price numeric not null
);

-- Wishlist table
create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- RLS Policies
alter table products enable row level security;
alter table cart enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table wishlist enable row level security;

-- Products: anyone can read, only admins can write
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Only admins can insert products" on products for insert with check (auth.jwt() ->> 'role' = 'admin');
create policy "Only admins can update products" on products for update using (auth.jwt() ->> 'role' = 'admin');
create policy "Only admins can delete products" on products for delete using (auth.jwt() ->> 'role' = 'admin');

-- Cart: users can only access their own cart
create policy "Users can view own cart" on cart for select using (auth.uid() = user_id);
create policy "Users can insert own cart" on cart for insert with check (auth.uid() = user_id);
create policy "Users can update own cart" on cart for update using (auth.uid() = user_id);
create policy "Users can delete own cart" on cart for delete using (auth.uid() = user_id);

-- Orders: users can only access their own orders
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);

-- Order items: users can view their own order items
create policy "Users can view own order items" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Users can insert order items" on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Wishlist: users can only access their own wishlist
create policy "Users can view own wishlist" on wishlist for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on wishlist for delete using (auth.uid() = user_id);

-- =============================================
-- ADMIN PANEL ADDITIONS
-- =============================================

-- Add city/state/pincode to orders table
alter table orders add column if not exists city text;
alter table orders add column if not exists state text;
alter table orders add column if not exists pincode text;
alter table orders add column if not exists razorpay_payment_id text;
alter table orders add column if not exists razorpay_order_id text;

-- Add stock_history table for audit log
create table if not exists stock_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  old_stock integer,
  new_stock integer,
  changed_by uuid references auth.users(id),
  reason text,
  created_at timestamptz default now()
);

alter table stock_history enable row level security;
create policy "Admins can manage stock history" on stock_history for all using (auth.jwt() ->> 'role' = 'admin');

-- Admin can read all orders
create policy "Admins can view all orders" on orders for select using (
  auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin'
);
create policy "Admins can update orders" on orders for update using (
  auth.jwt() ->> 'role' = 'admin'
);

-- Admin can read all order items
create policy "Admins can view all order items" on order_items for select using (
  auth.jwt() ->> 'role' = 'admin' OR
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Function to auto-reduce stock after order
create or replace function reduce_stock_on_order()
returns trigger as $$
begin
  update products
  set stock = stock - new.quantity
  where id = new.product_id and stock >= new.quantity;
  return new;
end;
$$ language plpgsql security definer;

create trigger after_order_item_insert
  after insert on order_items
  for each row execute function reduce_stock_on_order();

-- To set admin role on a user (run manually):
-- update auth.users set raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}' where email = 'admin@yourdomain.com';

-- =============================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- =============================================

-- Create the bucket (run in Supabase SQL editor)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated users to upload
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' AND auth.role() = 'authenticated');
