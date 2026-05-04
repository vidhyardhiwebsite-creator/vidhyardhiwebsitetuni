-- Site settings table for hero video and other configurable content
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

-- Anyone can read settings (for hero video)
create policy "Anyone can read site settings"
  on site_settings for select using (true);

-- Only authenticated users can update (admin only in practice)
create policy "Authenticated can update site settings"
  on site_settings for all using (auth.role() = 'authenticated');

-- Insert default hero video (update this URL after uploading to Supabase Storage)
insert into site_settings (key, value)
values ('hero_video_url', '')
on conflict (key) do nothing;

-- Allow authenticated users to upload hero videos to product-images bucket
-- (already covered by existing product-images bucket policies)
-- Just ensure the hero/ folder is accessible

-- Offer banner setting
insert into site_settings (key, value)
values ('offer_banner', '')
on conflict (key) do nothing;
