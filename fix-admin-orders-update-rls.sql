-- Fix: Allow admin users to update order_status on any order
-- Run this in Supabase SQL Editor

-- Drop existing restrictive update policy if any
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;

-- Allow users to update only their own orders (for cancellation etc)
CREATE POLICY "Users can update own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admin emails to update any order
CREATE POLICY "Admin can update orders"
ON orders FOR UPDATE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
    'sailendrakondapalli@gmail.com',
    'adduriaswani@gmail.com',
    'susmithajewlaries@gmail.com',
    'nashejewels@gmail.com',
    'naveenreddygandluri51@gmail.com',
    'aswaniadduri11@gmail.com'
  )
)
WITH CHECK (true);
