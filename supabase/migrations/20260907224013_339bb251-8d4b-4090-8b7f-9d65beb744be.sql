DROP TABLE IF EXISTS
  public.assignment_completions, public.assignment_targets, public.team_assignments,
  public.team_message_reactions, public.team_message_reports, public.team_messages,
  public.team_announcements, public.team_invitations, public.team_join_requests,
  public.team_members, public.teams, public.coach_feedback, public.personal_records,
  public.metric_entries, public.goals, public.activity_log, public.measurements,
  public.workouts, public.subscriptions, public.user_roles, public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.can_post_locker(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_assignment_target(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_diamond_plus(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.find_team_by_join_code(text) CASCADE;
DROP FUNCTION IF EXISTS public.can_view_metrics(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_coach(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.list_join_requests(uuid) CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;