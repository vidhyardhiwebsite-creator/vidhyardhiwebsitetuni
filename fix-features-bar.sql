-- Fix: Ensure features_bar and products_per_page settings exist in site_settings
-- Run this in Supabase SQL Editor

INSERT INTO site_settings (key, value)
VALUES 
  ('features_bar', '[{"id":1,"title":"Certified Quality","desc":"Authenticity Guaranteed"},{"id":2,"title":"Fast Shipping","desc":"Across India"},{"id":3,"title":"Easy Returns","desc":"7 Day Return Policy"},{"id":4,"title":"Handcrafted","desc":"Artisan made jewelry"}]'),
  ('products_per_page', '12')
ON CONFLICT (key) DO NOTHING;

-- Also ensure RLS allows authenticated users to upsert (not just update)
DROP POLICY IF EXISTS "Authenticated can update site settings" ON site_settings;

CREATE POLICY "Authenticated can upsert site settings"
ON site_settings FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
