-- supabase/migrations/001_leaderboard.sql

create table public.leaderboard_entries (
  id            uuid primary key default gen_random_uuid(),
  player_name   text not null check (char_length(player_name) between 1 and 50),
  score         integer not null check (score >= 0),
  level         text not null check (level in ('beginner', 'intermediate', 'advanced', 'mixed')),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  percentage    numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  created_at    timestamptz not null default now()
);

create index idx_leaderboard_score_desc on public.leaderboard_entries (score desc);
create index idx_leaderboard_level_score on public.leaderboard_entries (level, score desc);
create index idx_leaderboard_created_at on public.leaderboard_entries (created_at desc);

alter table public.leaderboard_entries enable row level security;

create policy "Allow anonymous insert"
  on public.leaderboard_entries
  for insert
  to anon
  with check (true);

create policy "Allow anonymous select"
  on public.leaderboard_entries
  for select
  to anon
  using (true);
