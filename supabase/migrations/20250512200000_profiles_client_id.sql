-- โปรไฟล์อ้างอิง Client (บริษัท/ผู้รับเหมา) แทน contractor_id / Contractors

alter table public.profiles
  drop constraint if exists profiles_contractor_id_fkey;

alter table public.profiles
  drop column if exists contractor_id;

alter table public.profiles
  add column if not exists client_id integer;

alter table public.profiles
  drop constraint if exists profiles_client_id_fkey;

alter table public.profiles
  add constraint profiles_client_id_fkey
  foreign key (client_id) references public."Client"(id) on delete set null;

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
  jid integer;
  clid integer;
begin
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  raw_job := nullif(trim(meta->>'job_id'), '');
  jid := null;
  if raw_job is not null then
    begin
      jid := raw_job::integer;
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
      clid := raw_client::integer;
    exception
      when others then
        clid := null;
    end;
  end if;

  if clid is not null and not exists (select 1 from public."Client" c where c.id = clid) then
    clid := null;
  end if;

  insert into public.profiles (id, fname, lname, phone, "Job", employee_id, client_id)
  values (
    new.id,
    nullif(trim(meta->>'fname'), ''),
    nullif(trim(meta->>'lname'), ''),
    nullif(trim(meta->>'phone'), ''),
    jid,
    nullif(trim(meta->>'employee_id'), ''),
    clid
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
