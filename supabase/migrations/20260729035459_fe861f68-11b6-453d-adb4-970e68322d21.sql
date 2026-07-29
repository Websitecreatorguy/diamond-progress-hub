drop policy "coach or invitee update invitation" on public.team_invitations;
create policy "coach or invitee update invitation" on public.team_invitations for update to authenticated
  using (public.is_team_coach(team_id, auth.uid()) or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')))
  with check (public.is_team_coach(team_id, auth.uid()) or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));

revoke execute on function public.has_role(uuid, public.app_role) from anon;
revoke execute on function public.is_team_member(uuid, uuid) from anon;
revoke execute on function public.is_team_coach(uuid, uuid) from anon;
revoke execute on function public.can_view_metrics(uuid, uuid) from anon;
revoke execute on function public.update_updated_at_column() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;