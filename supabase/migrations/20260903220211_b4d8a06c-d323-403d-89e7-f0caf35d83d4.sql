-- ============ TEAMS: new setup-wizard fields + settings ============
ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS team_level text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS head_coach_name text,
  ADD COLUMN IF NOT EXISTS assistant_coaches text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS practice_location text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS visible_metrics text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS chat_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS chat_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS announcements_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS member_list_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS locker_post_policy text NOT NULL DEFAULT 'everyone';

ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS secondary_positions text[] NOT NULL DEFAULT '{}';

CREATE UNIQUE INDEX IF NOT EXISTS teams_join_code_key ON public.teams (join_code);
CREATE INDEX IF NOT EXISTS team_members_user_idx ON public.team_members (user_id);
CREATE INDEX IF NOT EXISTS team_members_team_idx ON public.team_members (team_id);
CREATE UNIQUE INDEX IF NOT EXISTS team_members_team_user_key ON public.team_members (team_id, user_id);

-- ============ SAFE JOIN-CODE LOOKUP ============
CREATE OR REPLACE FUNCTION public.find_team_by_join_code(_code text)
RETURNS TABLE (id uuid, name text, organization text, age_group text, season text, team_level text, city text, state text, logo_url text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.name, t.organization, t.age_group, t.season, t.team_level, t.city, t.state, t.logo_url
  FROM public.teams t
  WHERE upper(t.join_code) = upper(btrim(_code))
  LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.find_team_by_join_code(text) TO authenticated;

-- ============ JOIN REQUESTS WITH PLAYER NAMES ============
CREATE OR REPLACE FUNCTION public.list_join_requests(_team_id uuid)
RETURNS TABLE (id uuid, team_id uuid, user_id uuid, status text, message text, created_at timestamptz, full_name text, avatar_url text, positions text[], age integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.team_id, r.user_id, r.status, r.message, r.created_at,
         p.full_name, p.avatar_url, p.positions, p.age
  FROM public.team_join_requests r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.team_id = _team_id
    AND public.is_team_coach(_team_id, auth.uid())
  ORDER BY r.created_at DESC
$$;
GRANT EXECUTE ON FUNCTION public.list_join_requests(uuid) TO authenticated;

-- ============ LOCKER ROOM MESSAGES ============
CREATE TABLE IF NOT EXISTS public.team_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  body text NOT NULL,
  kind text NOT NULL DEFAULT 'message',
  reply_to uuid REFERENCES public.team_messages(id) ON DELETE SET NULL,
  pinned boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS team_messages_team_created_idx ON public.team_messages (team_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_messages TO authenticated;
GRANT ALL ON public.team_messages TO service_role;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_post_locker(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teams t
    WHERE t.id = _team_id
      AND t.chat_enabled
      AND (
        public.is_team_coach(_team_id, _user_id)
        OR (
          NOT t.chat_locked
          AND t.locker_post_policy = 'everyone'
          AND public.is_team_member(_team_id, _user_id)
        )
      )
  )
$$;
GRANT EXECUTE ON FUNCTION public.can_post_locker(uuid, uuid) TO authenticated;

CREATE POLICY "members read team messages" ON public.team_messages
  FOR SELECT TO authenticated
  USING (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid()));

CREATE POLICY "members post team messages" ON public.team_messages
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.can_post_locker(team_id, auth.uid()));

CREATE POLICY "author or coach update messages" ON public.team_messages
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.is_team_coach(team_id, auth.uid()))
  WITH CHECK (author_id = auth.uid() OR public.is_team_coach(team_id, auth.uid()));

CREATE POLICY "author or coach delete messages" ON public.team_messages
  FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_team_coach(team_id, auth.uid()));

-- ============ REACTIONS ============
CREATE TABLE IF NOT EXISTS public.team_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.team_messages(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
CREATE INDEX IF NOT EXISTS team_message_reactions_msg_idx ON public.team_message_reactions (message_id);
GRANT SELECT, INSERT, DELETE ON public.team_message_reactions TO authenticated;
GRANT ALL ON public.team_message_reactions TO service_role;
ALTER TABLE public.team_message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read reactions" ON public.team_message_reactions
  FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "members add own reactions" ON public.team_message_reactions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid())));
CREATE POLICY "members remove own reactions" ON public.team_message_reactions
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============ REPORTS ============
CREATE TABLE IF NOT EXISTS public.team_message_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.team_messages(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL,
  reason text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.team_message_reports TO authenticated;
GRANT ALL ON public.team_message_reports TO service_role;
ALTER TABLE public.team_message_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reporter or coach read reports" ON public.team_message_reports
  FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "members report messages" ON public.team_message_reports
  FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() AND (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid())));
CREATE POLICY "coach resolve reports" ON public.team_message_reports
  FOR UPDATE TO authenticated USING (public.is_team_coach(team_id, auth.uid())) WITH CHECK (public.is_team_coach(team_id, auth.uid()));

-- ============ ASSIGNMENTS ============
CREATE TABLE IF NOT EXISTS public.team_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'other',
  due_date date,
  assign_all boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS team_assignments_team_idx ON public.team_assignments (team_id, due_date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_assignments TO authenticated;
GRANT ALL ON public.team_assignments TO service_role;
ALTER TABLE public.team_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.assignment_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.team_assignments(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, user_id)
);
CREATE INDEX IF NOT EXISTS assignment_targets_user_idx ON public.assignment_targets (user_id);
GRANT SELECT, INSERT, DELETE ON public.assignment_targets TO authenticated;
GRANT ALL ON public.assignment_targets TO service_role;
ALTER TABLE public.assignment_targets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.assignment_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.team_assignments(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  note text,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, user_id)
);
CREATE INDEX IF NOT EXISTS assignment_completions_assignment_idx ON public.assignment_completions (assignment_id);
GRANT SELECT, INSERT, DELETE ON public.assignment_completions TO authenticated;
GRANT ALL ON public.assignment_completions TO service_role;
ALTER TABLE public.assignment_completions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_assignment_target(_assignment_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_assignments a
    WHERE a.id = _assignment_id
      AND public.is_team_member(a.team_id, _user_id)
      AND (
        a.assign_all
        OR EXISTS (SELECT 1 FROM public.assignment_targets t WHERE t.assignment_id = a.id AND t.user_id = _user_id)
      )
  )
$$;
GRANT EXECUTE ON FUNCTION public.is_assignment_target(uuid, uuid) TO authenticated;

CREATE POLICY "members read assignments" ON public.team_assignments
  FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "coach create assignments" ON public.team_assignments
  FOR INSERT TO authenticated WITH CHECK (public.is_team_coach(team_id, auth.uid()) AND coach_id = auth.uid());
CREATE POLICY "coach update assignments" ON public.team_assignments
  FOR UPDATE TO authenticated USING (public.is_team_coach(team_id, auth.uid())) WITH CHECK (public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "coach delete assignments" ON public.team_assignments
  FOR DELETE TO authenticated USING (public.is_team_coach(team_id, auth.uid()));

CREATE POLICY "members read targets" ON public.assignment_targets
  FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "coach set targets" ON public.assignment_targets
  FOR INSERT TO authenticated WITH CHECK (public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "coach remove targets" ON public.assignment_targets
  FOR DELETE TO authenticated USING (public.is_team_coach(team_id, auth.uid()));

CREATE POLICY "members read completions" ON public.assignment_completions
  FOR SELECT TO authenticated USING (public.is_team_member(team_id, auth.uid()) OR public.is_team_coach(team_id, auth.uid()));
CREATE POLICY "player completes own assignment" ON public.assignment_completions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_assignment_target(assignment_id, auth.uid()));
CREATE POLICY "player undoes own completion" ON public.assignment_completions
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============ SUBSCRIPTIONS (Diamond+) ============
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'inactive',
  plan text NOT NULL DEFAULT 'diamond_plus',
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_customer_idx ON public.subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_sub_idx ON public.subscriptions (stripe_subscription_id);

-- read-only for the owner; writes are backend-only (service role) so nobody can self-grant Diamond+
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own subscription" ON public.subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_diamond_plus(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = _user_id
      AND s.status IN ('active', 'trialing')
      AND (s.current_period_end IS NULL OR s.current_period_end > now())
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_diamond_plus(uuid) TO authenticated;

-- ============ updated_at triggers ============
DROP TRIGGER IF EXISTS team_messages_updated_at ON public.team_messages;
CREATE TRIGGER team_messages_updated_at BEFORE UPDATE ON public.team_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS team_assignments_updated_at ON public.team_assignments;
CREATE TRIGGER team_assignments_updated_at BEFORE UPDATE ON public.team_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- realtime for locker room
ALTER TABLE public.team_messages REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;