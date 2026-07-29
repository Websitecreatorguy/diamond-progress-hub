-- ============ roles ============
create type public.app_role as enum ('player','parent','coach','admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "insert own roles" on public.user_roles for insert to authenticated with check (auth.uid() = user_id);

-- ============ profiles additions ============
alter table public.profiles
  add column if not exists account_type text not null default 'player',
  add column if not exists jersey_number text,
  add column if not exists grad_year integer,
  add column if not exists secondary_positions text[],
  add column if not exists profile_visibility text not null default 'team',
  add column if not exists share_metrics boolean not null default true,
  add column if not exists hidden_metrics text[] not null default '{}',
  add column if not exists onboarded boolean not null default false;

-- ============ teams ============
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  age_group text,
  season text,
  logo_url text,
  join_code text not null unique,
  owner_id uuid not null,
  comparisons_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.teams to authenticated;
grant all on public.teams to service_role;
alter table public.teams enable row level security;

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null,
  team_role text not null default 'player',
  jersey_number text,
  position text,
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;

create or replace function public.is_team_member(_team_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.team_members where team_id = _team_id and user_id = _user_id)
$$;

create or replace function public.is_team_coach(_team_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.teams t where t.id = _team_id and t.owner_id = _user_id
  ) or exists (
    select 1 from public.team_members m
    where m.team_id = _team_id and m.user_id = _user_id and m.team_role in ('coach','admin')
  )
$$;

create policy "members read team" on public.teams for select to authenticated
  using (owner_id = auth.uid() or public.is_team_member(id, auth.uid()));
create policy "coaches create team" on public.teams for insert to authenticated
  with check (owner_id = auth.uid());
create policy "coaches update team" on public.teams for update to authenticated
  using (public.is_team_coach(id, auth.uid())) with check (public.is_team_coach(id, auth.uid()));
create policy "owner delete team" on public.teams for delete to authenticated
  using (owner_id = auth.uid());

create policy "members read roster" on public.team_members for select to authenticated
  using (user_id = auth.uid() or public.is_team_member(team_id, auth.uid()));
create policy "coaches add members" on public.team_members for insert to authenticated
  with check (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid());
create policy "coaches update members" on public.team_members for update to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid())
  with check (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid());
create policy "coaches or self remove members" on public.team_members for delete to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid());

-- ============ join requests & invitations ============
create table public.team_join_requests (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index team_join_requests_pending_uniq
  on public.team_join_requests (team_id, user_id) where status = 'pending';
grant select, insert, update, delete on public.team_join_requests to authenticated;
grant all on public.team_join_requests to service_role;
alter table public.team_join_requests enable row level security;

create policy "self or coach read requests" on public.team_join_requests for select to authenticated
  using (user_id = auth.uid() or public.is_team_coach(team_id, auth.uid()));
create policy "self create request" on public.team_join_requests for insert to authenticated
  with check (user_id = auth.uid());
create policy "coach update request" on public.team_join_requests for update to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid())
  with check (public.is_team_coach(team_id, auth.uid()) or user_id = auth.uid());
create policy "self or coach delete request" on public.team_join_requests for delete to authenticated
  using (user_id = auth.uid() or public.is_team_coach(team_id, auth.uid()));

create table public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  email text not null,
  invited_by uuid not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index team_invitations_pending_uniq
  on public.team_invitations (team_id, lower(email)) where status = 'pending';
grant select, insert, update, delete on public.team_invitations to authenticated;
grant all on public.team_invitations to service_role;
alter table public.team_invitations enable row level security;

create policy "coach or invitee read invitation" on public.team_invitations for select to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));
create policy "coach create invitation" on public.team_invitations for insert to authenticated
  with check (public.is_team_coach(team_id, auth.uid()) and invited_by = auth.uid());
create policy "coach or invitee update invitation" on public.team_invitations for update to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')))
  with check (true);
create policy "coach delete invitation" on public.team_invitations for delete to authenticated
  using (public.is_team_coach(team_id, auth.uid()));

-- ============ metric entries ============
create table public.metric_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  metric text not null,
  value numeric not null,
  unit text not null,
  recorded_on date not null default current_date,
  setting text not null default 'training',
  notes text,
  video_url text,
  created_at timestamptz not null default now()
);
create index metric_entries_user_metric_idx on public.metric_entries (user_id, metric, recorded_on);
grant select, insert, update, delete on public.metric_entries to authenticated;
grant all on public.metric_entries to service_role;
alter table public.metric_entries enable row level security;

create or replace function public.can_view_metrics(_owner uuid, _viewer uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select _owner = _viewer or (
    exists (select 1 from public.profiles p where p.id = _owner and p.share_metrics)
    and exists (
      select 1 from public.team_members a
      join public.team_members b on a.team_id = b.team_id
      where a.user_id = _owner and b.user_id = _viewer
    )
  )
$$;

create policy "own or shared metrics read" on public.metric_entries for select to authenticated
  using (public.can_view_metrics(user_id, auth.uid()));
create policy "own metrics write" on public.metric_entries for insert to authenticated
  with check (user_id = auth.uid());
create policy "own metrics update" on public.metric_entries for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own metrics delete" on public.metric_entries for delete to authenticated
  using (user_id = auth.uid());

-- ============ goals ============
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  metric text,
  unit text,
  start_value numeric,
  current_value numeric,
  target_value numeric not null,
  target_date date,
  direction text not null default 'up',
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.goals to authenticated;
grant all on public.goals to service_role;
alter table public.goals enable row level security;
create policy "own goals" on public.goals for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============ personal records ============
create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  metric text not null,
  value numeric not null,
  unit text not null,
  previous_value numeric,
  achieved_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, metric)
);
grant select, insert, update, delete on public.personal_records to authenticated;
grant all on public.personal_records to service_role;
alter table public.personal_records enable row level security;
create policy "own or shared records read" on public.personal_records for select to authenticated
  using (public.can_view_metrics(user_id, auth.uid()));
create policy "own records write" on public.personal_records for insert to authenticated
  with check (user_id = auth.uid());
create policy "own records update" on public.personal_records for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own records delete" on public.personal_records for delete to authenticated
  using (user_id = auth.uid());

-- ============ announcements ============
create table public.team_announcements (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  author_id uuid not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.team_announcements to authenticated;
grant all on public.team_announcements to service_role;
alter table public.team_announcements enable row level security;
create policy "members read announcements" on public.team_announcements for select to authenticated
  using (public.is_team_member(team_id, auth.uid()) or public.is_team_coach(team_id, auth.uid()));
create policy "coaches write announcements" on public.team_announcements for insert to authenticated
  with check (public.is_team_coach(team_id, auth.uid()) and author_id = auth.uid());
create policy "coaches update announcements" on public.team_announcements for update to authenticated
  using (public.is_team_coach(team_id, auth.uid())) with check (public.is_team_coach(team_id, auth.uid()));
create policy "coaches delete announcements" on public.team_announcements for delete to authenticated
  using (public.is_team_coach(team_id, auth.uid()));

-- ============ coach feedback ============
create table public.coach_feedback (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  coach_id uuid not null,
  player_id uuid not null,
  strength text,
  area_to_improve text,
  weekly_focus text,
  recommended_drill text,
  private_note text,
  player_note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.coach_feedback to authenticated;
grant all on public.coach_feedback to service_role;
alter table public.coach_feedback enable row level security;
create policy "player or coach read feedback" on public.coach_feedback for select to authenticated
  using (player_id = auth.uid() or public.is_team_coach(team_id, auth.uid()));
create policy "coach write feedback" on public.coach_feedback for insert to authenticated
  with check (public.is_team_coach(team_id, auth.uid()) and coach_id = auth.uid());
create policy "coach update feedback" on public.coach_feedback for update to authenticated
  using (public.is_team_coach(team_id, auth.uid()) and coach_id = auth.uid())
  with check (public.is_team_coach(team_id, auth.uid()) and coach_id = auth.uid());
create policy "coach delete feedback" on public.coach_feedback for delete to authenticated
  using (public.is_team_coach(team_id, auth.uid()) and coach_id = auth.uid());

create or replace view public.coach_feedback_for_player
with (security_invoker = true) as
  select id, team_id, coach_id, player_id, strength, area_to_improve, weekly_focus,
         recommended_drill, player_note, created_at
  from public.coach_feedback;
grant select on public.coach_feedback_for_player to authenticated;

-- ============ activity ============
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,
  title text not null,
  detail text,
  created_at timestamptz not null default now()
);
create index activity_log_user_idx on public.activity_log (user_id, created_at desc);
grant select, insert, delete on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "own activity read" on public.activity_log for select to authenticated
  using (user_id = auth.uid());
create policy "own activity write" on public.activity_log for insert to authenticated
  with check (user_id = auth.uid());
create policy "own activity delete" on public.activity_log for delete to authenticated
  using (user_id = auth.uid());

-- ============ teammate-visible profile reads ============
create policy "teammates read profile" on public.profiles for select to authenticated
  using (
    exists (
      select 1 from public.team_members a
      join public.team_members b on a.team_id = b.team_id
      where a.user_id = profiles.id and b.user_id = auth.uid()
    )
  );

-- ============ updated_at triggers ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger teams_updated_at before update on public.teams
  for each row execute function public.update_updated_at_column();
create trigger goals_updated_at before update on public.goals
  for each row execute function public.update_updated_at_column();
create trigger join_requests_updated_at before update on public.team_join_requests
  for each row execute function public.update_updated_at_column();
create trigger invitations_updated_at before update on public.team_invitations
  for each row execute function public.update_updated_at_column();