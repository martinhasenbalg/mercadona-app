-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- Dashboard → SQL Editor → New query → pegar y ejecutar

-- =============================================
-- TABLA: favorites
-- =============================================
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  text not null,
  product_data jsonb not null,
  added_at    timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Row Level Security: cada usuario solo ve sus favoritos
alter table public.favorites enable row level security;

create policy "Favorites: select own" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Favorites: insert own" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Favorites: delete own" on public.favorites
  for delete using (auth.uid() = user_id);

-- =============================================
-- TABLA: shopping_list_items
-- =============================================
create table if not exists public.shopping_list_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  text not null,
  product_data jsonb not null,
  quantity    integer not null default 1 check (quantity >= 1),
  added_at    timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Row Level Security
alter table public.shopping_list_items enable row level security;

create policy "Shopping: select own" on public.shopping_list_items
  for select using (auth.uid() = user_id);

create policy "Shopping: insert own" on public.shopping_list_items
  for insert with check (auth.uid() = user_id);

create policy "Shopping: update own" on public.shopping_list_items
  for update using (auth.uid() = user_id);

create policy "Shopping: delete own" on public.shopping_list_items
  for delete using (auth.uid() = user_id);
