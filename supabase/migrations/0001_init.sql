-- JNV Studio — initial schema
-- Run this whole file once in Supabase → SQL Editor → New query → Run.


-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- site settings ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'JNV Studio',
  school_name text not null default 'PM SHRI School JNV Serchhip, Thenzawl',
  tagline text not null default 'Kan naupangte siam game leh hla',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;

-- ---------- games ----------
create table if not exists public.game_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'gamepad-2',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.game_categories (name, slug, icon, sort_order) values
  ('Puzzle', 'puzzle', 'puzzle', 1),
  ('Action', 'action', 'swords', 2),
  ('Quiz', 'quiz', 'circle-help', 3),
  ('Racing', 'racing', 'car', 4),
  ('Others', 'others', 'sparkles', 5)
on conflict (slug) do nothing;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category_id uuid references public.game_categories(id) on delete set null,
  class smallint check (class in (7, 8, 9)),
  creators text not null default '',
  cover_url text,
  cover_sm_url text,
  accent_color text not null default '#F7931E',
  show_title_overlay boolean not null default true,
  html_code text not null default '',
  plays int not null default 0,
  likes int not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(creators, ''))
  ) stored
);
create index if not exists games_pub_idx on public.games (published, category_id, class);
create index if not exists games_featured_idx on public.games (featured) where published;
create index if not exists games_search_idx on public.games using gin (search);
drop trigger if exists games_updated on public.games;
create trigger games_updated before update on public.games
  for each row execute function public.set_updated_at();

-- ---------- music ----------
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text,
  accent_color text not null default '#F7931E',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.albums (name, slug, description, accent_color, sort_order) values
  ('Mizo', 'mizo', 'Mizo hla — Gospel leh Lengzem', '#F7931E', 1),
  ('English', 'english', 'English songs — Gospel and more', '#3B82F6', 2),
  ('Hindi', 'hindi', 'हिंदी गाने — Hindi songs', '#2EA043', 3)
on conflict (slug) do nothing;

create table if not exists public.genres (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (album_id, slug)
);

insert into public.genres (album_id, name, slug, sort_order)
select a.id, g.name, g.slug, g.sort_order
from (values
  ('mizo', 'Gospel', 'gospel', 1),
  ('mizo', 'Lengzem', 'lengzem', 2),
  ('english', 'Gospel', 'gospel', 1),
  ('english', 'Others', 'others', 2)
) as g(album_slug, name, slug, sort_order)
join public.albums a on a.slug = g.album_slug
on conflict (album_id, slug) do nothing;

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  album_id uuid not null references public.albums(id) on delete cascade,
  genre_id uuid references public.genres(id) on delete set null,
  title text not null,
  creators text not null default '',
  class smallint check (class in (7, 8, 9)),
  audio_url text not null,
  cover_url text,
  cover_sm_url text,
  lyrics text not null default '',
  duration_sec int not null default 0,
  plays int not null default 0,
  likes int not null default 0,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(creators, ''))
  ) stored
);
create index if not exists tracks_pub_idx on public.tracks (published, album_id, genre_id, sort_order);
create index if not exists tracks_search_idx on public.tracks using gin (search);
drop trigger if exists tracks_updated on public.tracks;
create trigger tracks_updated before update on public.tracks
  for each row execute function public.set_updated_at();

-- a track's genre must belong to the same album
create or replace function public.check_track_genre()
returns trigger language plpgsql as $$
begin
  if new.genre_id is not null and not exists (
    select 1 from public.genres g where g.id = new.genre_id and g.album_id = new.album_id
  ) then
    raise exception 'Genre does not belong to this album';
  end if;
  return new;
end $$;
drop trigger if exists tracks_genre_check on public.tracks;
create trigger tracks_genre_check before insert or update on public.tracks
  for each row execute function public.check_track_genre();

-- ---------- admin login rate limit ----------
create table if not exists public.login_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists login_attempts_idx on public.login_attempts (ip_hash, attempted_at);

-- ---------- row level security ----------
alter table public.site_settings enable row level security;
alter table public.game_categories enable row level security;
alter table public.games enable row level security;
alter table public.albums enable row level security;
alter table public.genres enable row level security;
alter table public.tracks enable row level security;
alter table public.login_attempts enable row level security;

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using (true);
drop policy if exists "public read categories" on public.game_categories;
create policy "public read categories" on public.game_categories for select using (true);
drop policy if exists "public read games" on public.games;
create policy "public read games" on public.games for select using (published);
drop policy if exists "public read albums" on public.albums;
create policy "public read albums" on public.albums for select using (true);
drop policy if exists "public read genres" on public.genres;
create policy "public read genres" on public.genres for select using (true);
drop policy if exists "public read tracks" on public.tracks;
create policy "public read tracks" on public.tracks for select using (published);
-- login_attempts: no policies → only the service role can touch it.
-- No insert/update/delete policies anywhere → admin writes use the service role on the server.

-- ---------- public counters ----------
create or replace function public.increment_game_play(game_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.games set plays = plays + 1 where id = game_id and published;
$$;
create or replace function public.add_game_like(game_id uuid)
returns int language sql security definer set search_path = public as $$
  update public.games set likes = likes + 1 where id = game_id and published returning likes;
$$;
create or replace function public.increment_track_play(track_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.tracks set plays = plays + 1 where id = track_id and published;
$$;
create or replace function public.add_track_like(track_id uuid)
returns int language sql security definer set search_path = public as $$
  update public.tracks set likes = likes + 1 where id = track_id and published returning likes;
$$;
revoke all on function public.increment_game_play(uuid) from public;
revoke all on function public.add_game_like(uuid) from public;
revoke all on function public.increment_track_play(uuid) from public;
revoke all on function public.add_track_like(uuid) from public;
grant execute on function public.increment_game_play(uuid) to anon, authenticated;
grant execute on function public.add_game_like(uuid) to anon, authenticated;
grant execute on function public.increment_track_play(uuid) to anon, authenticated;
grant execute on function public.add_track_like(uuid) to anon, authenticated;

-- ---------- storage ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('covers', 'covers', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('audio', 'audio', true, 15728640, array['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
-- Uploads use signed upload URLs created on the server, so no anon write policy is needed.
