-- Add tracking fields to orders table
alter table orders add column if not exists tracking_id text;
alter table orders add column if not exists tracking_image_url text;
alter table orders add column if not exists tracking_updated_at timestamptz;
