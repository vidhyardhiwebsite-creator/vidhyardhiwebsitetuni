-- Add order_status column for delivery tracking
alter table orders add column if not exists order_status text default 'confirmed';

-- Update existing paid orders to confirmed
update orders set order_status = 'confirmed' where payment_status = 'paid' and order_status is null;
update orders set order_status = 'pending' where payment_status = 'pending' and order_status is null;
