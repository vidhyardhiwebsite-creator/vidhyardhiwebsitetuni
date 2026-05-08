-- Add custom_id field to products (admin sets this manually)
alter table products add column if not exists custom_id text unique;

-- Index for fast lookup
create index if not exists idx_products_custom_id on products(custom_id);
