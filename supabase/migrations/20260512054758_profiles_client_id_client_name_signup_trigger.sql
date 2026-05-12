-- Applied on remote Supabase (Concrete Works) via MCP 2026-05-12
-- profiles: Client link + ชื่อสำเนา + trigger สมัครจาก user_metadata

alter table public.profiles add column if not exists client_id bigint;
alter table public.profiles add column if not exists client_name text;

comment on column public.profiles.client_name is 'ชื่อบริษัท/ผู้รับเหมา — sync จาก Client.client_name';

alter table public.profiles drop constraint if exists profiles_client_id_fkey;
alter table public.profiles
  add constraint profiles_client_id_fkey
  foreign key (client_id) references public."Client"(id) on delete set null;

update public.profiles p
set client_name = nullif(trim(c.client_name), '')
from public."Client" c
where p.client_id is not null and p.client_id = c.id
  and (p.client_name is null or trim(coalesce(p.client_name, '')) = '');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb;
  raw_job text;
  raw_client text;
  jid bigint;
  clid bigint;
  cname text;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  raw_job := nullif(trim(meta->>'job_id'), '');
  jid := null;
  if raw_job is not null then
    begin
      jid := raw_job::bigint;
    exception
      when others then
        jid := null;
    end;
  end if;

  if jid is not null and not exists (select 1 from public."Jobs" j where j.id = jid) then
    jid := null;
  end if;

  raw_client := nullif(trim(meta->>'client_id'), '');
  clid := null;
  if raw_client is not null then
    begin
      clid := raw_client::bigint;
    exception
      when others then
        clid := null;
    end;
  end if;

  if clid is not null and not exists (select 1 from public."Client" c where c.id = clid) then
    clid := null;
  end if;

  cname := null;
  if clid is not null then
    select nullif(trim(c.client_name), '') into cname from public."Client" c where c.id = clid limit 1;
  end if;

  insert into public.profiles (id, fname, lname, phone, "Job", employee_id, client_id, client_name)
  values (
    new.id,
    nullif(trim(meta->>'fname'), ''),
    nullif(trim(meta->>'lname'), ''),
    nullif(trim(meta->>'phone'), ''),
    jid,
    nullif(trim(meta->>'employee_id'), ''),
    clid,
    cname
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
