revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.is_team_member(uuid, uuid) from public, anon;
revoke execute on function public.is_team_coach(uuid, uuid) from public, anon;
revoke execute on function public.can_view_metrics(uuid, uuid) from public, anon;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_team_member(uuid, uuid) to authenticated;
grant execute on function public.is_team_coach(uuid, uuid) to authenticated;
grant execute on function public.can_view_metrics(uuid, uuid) to authenticated;