-- Add series_id to products (admin sets this when uploading)
alter table products add column if not exists series_id text default 'NS0';

-- Add series tracking to orders (auto-derived from ordered products)
alter table orders add column if not exists order_series text;
