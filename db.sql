-- enable extension
create extension if not exists "pgcrypto";

-- profiles table (you already have this)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now()
);

-- todos table (already in your sql, include user_id reference)
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  description text,
  is_complete boolean default false,
  due_date timestamptz,
  priority int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trigger to update updated_at
create or replace function trigger_set_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_timestamp on todos;
create trigger set_timestamp
  before update on todos
  for each row execute procedure trigger_set_timestamp();

-- RLS: enable row level security
alter table todos enable row level security;

-- Allow owners to SELECT/INSERT/UPDATE/DELETE their own todos
create policy "Todos: Owners can manage their todos" on todos
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Additionally, allow admins (role='admin' in profiles) to manage all todos.
-- We will create a function to check if current user is admin
create or replace function is_admin()
returns boolean language sql stable as $$
select exists (
  select 1 from profiles p
  where p.id = auth.uid() and p.role = 'admin'
);
$$;

create policy "Todos: admins can manage all" on todos
  for all
  using (is_admin())
  with check (is_admin());

-- Profiles RLS (restrict updates to owner only)
alter table profiles enable row level security;

create policy "Profiles: owner can manage" on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow admins to read profiles
create policy "Profiles: admins can read" on profiles
  for select
  using (is_admin());
