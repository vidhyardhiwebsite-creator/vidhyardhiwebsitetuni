-- Clear all test orders and related data
-- Run this in Supabase SQL Editor to reset for production launch
-- This ONLY deletes orders/order_items data — products, users, settings are untouched

-- Delete order items first (foreign key dependency)
DELETE FROM order_items;

-- Delete all orders
DELETE FROM orders;

-- Reset the order series counters so next order starts from NS0-001 / NS1-001
-- (Only run if you have a sequences/counters table — skip if not)
-- UPDATE order_series SET current_number = 0 WHERE series_id IN ('NS0', 'NS1');

-- Verify
SELECT 
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COUNT(*) FROM order_items) AS total_order_items;
