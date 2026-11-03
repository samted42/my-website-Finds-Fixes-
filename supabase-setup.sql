-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  network text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  store_id uuid references stores(id) on delete restrict,
  niche text not null default 'tech' check (niche in ('tech','home','fash','fit')),
  badge text,
  verdict text,
  image text check (image is null or image ~ '^(https://|[A-Za-z0-9_./-]+$)'),
  link text not null check (link ~* '^https://'),
  created_at timestamptz not null default now()
);

alter table stores enable row level security;
alter table products enable row level security;

-- Anyone can read (the public site needs this).
create policy "public can read stores" on stores for select to anon, authenticated using (true);
create policy "public can read products" on products for select to anon, authenticated using (true);

-- Only logged-in users can add, change or remove.
create policy "logged in users manage stores" on stores for all to authenticated using (true) with check (true);
create policy "logged in users manage products" on products for all to authenticated using (true) with check (true);
