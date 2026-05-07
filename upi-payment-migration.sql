-- Add payment screenshot and UPI fields to orders
alter table orders add column if not exists payment_method text default 'upi';
alter table orders add column if not exists payment_screenshot_url text;
alter table orders add column if not exists upi_ref text;
alter table orders add column if not exists payment_verified boolean default false;

-- Allow users to update their own orders (for screenshot upload)
drop policy if exists "Users manage own orders update" on orders;
create policy "Users manage own orders update"
  on orders for update
  using (auth.uid() = user_id);

-- Storage bucket for payment screenshots
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-screenshots', 'payment-screenshots', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do update set file_size_limit = 10485760;

-- Only the user who owns the order can upload their screenshot
create policy "Users upload own payment screenshot"
  on storage.objects for insert
  with check (bucket_id = 'payment-screenshots' and auth.role() = 'authenticated');

-- Admins can read all screenshots
create policy "Admins read payment screenshots"
  on storage.objects for select
  using (bucket_id = 'payment-screenshots' and auth.role() = 'authenticated');
