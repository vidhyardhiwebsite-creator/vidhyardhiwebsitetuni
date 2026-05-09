-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  user_avatar text,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now()
);

alter table reviews enable row level security;

-- Anyone can read reviews
create policy "Reviews are public" on reviews for select using (true);

-- Logged-in users can insert their own review
create policy "Users can insert own review" on reviews for insert
  with check (auth.uid() = user_id);

-- Users can update their own review
create policy "Users can update own review" on reviews for update
  using (auth.uid() = user_id);

-- Users can delete their own review
create policy "Users can delete own review" on reviews for delete
  using (auth.uid() = user_id);
