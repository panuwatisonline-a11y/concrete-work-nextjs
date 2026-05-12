-- Copy fname, lname, phone, Job from auth signup user_metadata into public.profiles
-- when the row is created (covers email-confirmation flows where no client session exists yet).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb;
  raw_job text;
  jid integer;
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

  insert into public.profiles (id, fname, lname, phone, "Job")
  values (
    new.id,
    nullif(trim(meta->>'fname'), ''),
    nullif(trim(meta->>'lname'), ''),
    nullif(trim(meta->>'phone'), ''),
    jid
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
