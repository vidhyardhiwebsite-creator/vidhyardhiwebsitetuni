-- Add order series fields
alter table orders add column if not exists order_series text default 'NS0';
alter table orders add column if not exists series_number integer;

-- Create a sequence counter table for each series
create table if not exists order_series_counter (
  series text primary key,
  last_number integer default 0
);

insert into order_series_counter (series, last_number) values ('NS0', 0), ('NS1', 0)
on conflict (series) do nothing;

-- Function to get next series number atomically
create or replace function get_next_series_number(p_series text)
returns integer as $$
declare
  next_num integer;
begin
  update order_series_counter
  set last_number = last_number + 1
  where series = p_series
  returning last_number into next_num;
  return next_num;
end;
$$ language plpgsql security definer;

-- Allow authenticated users to call this function
grant execute on function get_next_series_number(text) to authenticated;

-- RLS for counter table - read only for users
alter table order_series_counter enable row level security;
create policy "Anyone can read series counter" on order_series_counter for select using (true);
create policy "Authenticated can update series counter" on order_series_counter for update using (auth.role() = 'authenticated');
