-- ============================================================
-- ADMIN ACCESS FIX - Run in Supabase SQL Editor
-- ============================================================

-- Allow admins to read ALL orders (not just their own)
drop policy if exists "Users manage own orders select" on orders;
drop policy if exists "Admin read all orders" on orders;

create policy "Users or admin read orders"
  on orders for select
  using (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' IN (
      'sailendrakondapalli@gmail.com',
      'adduriaswani@gmail.com',
      'susmithajewlaries@gmail.com'
    )
  );

-- Allow admins to update ALL orders
drop policy if exists "Users manage own orders update" on orders;
create policy "Users or admin update orders"
  on orders for update
  using (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' IN (
      'sailendrakondapalli@gmail.com',
      'adduriaswani@gmail.com',
      'susmithajewlaries@gmail.com'
    )
  );

-- Allow admins to read ALL order items
drop policy if exists "Users view own order items" on order_items;
create policy "Users or admin view order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and (
        orders.user_id = auth.uid()
        OR auth.jwt() ->> 'email' IN (
          'sailendrakondapalli@gmail.com',
          'adduriaswani@gmail.com',
          'susmithajewlaries@gmail.com'
        )
      )
    )
  );

-- Allow admins to update order_status on any order
drop policy if exists "Users or admin update orders" on orders;
create policy "Users or admin update orders"
  on orders for update
  using (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' IN (
      'sailendrakondapalli@gmail.com',
      'adduriaswani@gmail.com',
      'susmithajewlaries@gmail.com'
    )
  )
  with check (
    auth.uid() = user_id
    OR auth.jwt() ->> 'email' IN (
      'sailendrakondapalli@gmail.com',
      'adduriaswani@gmail.com',
      'susmithajewlaries@gmail.com'
    )
  );
