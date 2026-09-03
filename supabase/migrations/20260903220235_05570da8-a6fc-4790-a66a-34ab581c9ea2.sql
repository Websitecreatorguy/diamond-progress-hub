-- Internal helpers used only inside RLS policies: no direct API access.
REVOKE ALL ON FUNCTION public.can_view_metrics(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_team_coach(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_team_member(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_post_locker(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_assignment_target(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_diamond_plus(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Keep team/coach checks callable by signed-in users (used by UI permission checks).
GRANT EXECUTE ON FUNCTION public.is_team_coach(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Intentional client-facing lookups.
REVOKE ALL ON FUNCTION public.find_team_by_join_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_team_by_join_code(text) TO authenticated;
REVOKE ALL ON FUNCTION public.list_join_requests(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_join_requests(uuid) TO authenticated;