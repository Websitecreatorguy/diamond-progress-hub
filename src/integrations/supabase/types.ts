export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          kind: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      assignment_completions: {
        Row: {
          assignment_id: string
          completed_at: string
          id: string
          note: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string
          id?: string
          note?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string
          id?: string
          note?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_completions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "team_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_completions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_targets: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_targets_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "team_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_targets_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_feedback: {
        Row: {
          area_to_improve: string | null
          coach_id: string
          created_at: string
          id: string
          player_id: string
          player_note: string | null
          private_note: string | null
          recommended_drill: string | null
          strength: string | null
          team_id: string
          weekly_focus: string | null
        }
        Insert: {
          area_to_improve?: string | null
          coach_id: string
          created_at?: string
          id?: string
          player_id: string
          player_note?: string | null
          private_note?: string | null
          recommended_drill?: string | null
          strength?: string | null
          team_id: string
          weekly_focus?: string | null
        }
        Update: {
          area_to_improve?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          player_id?: string
          player_note?: string | null
          private_note?: string | null
          recommended_drill?: string | null
          strength?: string | null
          team_id?: string
          weekly_focus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_feedback_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          current_value: number | null
          direction: string
          id: string
          metric: string | null
          start_value: number | null
          target_date: string | null
          target_value: number
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          direction?: string
          id?: string
          metric?: string | null
          start_value?: number | null
          target_date?: string | null
          target_value: number
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          direction?: string
          id?: string
          metric?: string | null
          start_value?: number | null
          target_date?: string | null
          target_value?: number
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      measurements: {
        Row: {
          bat_speed_mph: number | null
          created_at: string
          exit_velo_mph: number | null
          height_in: number | null
          home_to_first_sec: number | null
          id: string
          measured_at: string
          notes: string | null
          pitch_velo_mph: number | null
          sixty_yd_sec: number | null
          throw_velo_mph: number | null
          user_id: string
          weight_lb: number | null
        }
        Insert: {
          bat_speed_mph?: number | null
          created_at?: string
          exit_velo_mph?: number | null
          height_in?: number | null
          home_to_first_sec?: number | null
          id?: string
          measured_at?: string
          notes?: string | null
          pitch_velo_mph?: number | null
          sixty_yd_sec?: number | null
          throw_velo_mph?: number | null
          user_id: string
          weight_lb?: number | null
        }
        Update: {
          bat_speed_mph?: number | null
          created_at?: string
          exit_velo_mph?: number | null
          height_in?: number | null
          home_to_first_sec?: number | null
          id?: string
          measured_at?: string
          notes?: string | null
          pitch_velo_mph?: number | null
          sixty_yd_sec?: number | null
          throw_velo_mph?: number | null
          user_id?: string
          weight_lb?: number | null
        }
        Relationships: []
      }
      metric_entries: {
        Row: {
          created_at: string
          id: string
          metric: string
          notes: string | null
          recorded_on: string
          setting: string
          unit: string
          user_id: string
          value: number
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metric: string
          notes?: string | null
          recorded_on?: string
          setting?: string
          unit: string
          user_id: string
          value: number
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metric?: string
          notes?: string | null
          recorded_on?: string
          setting?: string
          unit?: string
          user_id?: string
          value?: number
          video_url?: string | null
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          achieved_on: string
          created_at: string
          id: string
          metric: string
          previous_value: number | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          achieved_on?: string
          created_at?: string
          id?: string
          metric: string
          previous_value?: number | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          achieved_on?: string
          created_at?: string
          id?: string
          metric?: string
          previous_value?: number | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string
          age: number | null
          avatar_url: string | null
          bats: string | null
          created_at: string
          full_name: string | null
          grad_year: number | null
          height_in: number | null
          hidden_metrics: string[]
          id: string
          jersey_number: string | null
          onboarded: boolean
          positions: string[] | null
          profile_visibility: string
          secondary_positions: string[] | null
          share_metrics: boolean
          team: string | null
          throws: string | null
          updated_at: string
          weight_lb: number | null
        }
        Insert: {
          account_type?: string
          age?: number | null
          avatar_url?: string | null
          bats?: string | null
          created_at?: string
          full_name?: string | null
          grad_year?: number | null
          height_in?: number | null
          hidden_metrics?: string[]
          id: string
          jersey_number?: string | null
          onboarded?: boolean
          positions?: string[] | null
          profile_visibility?: string
          secondary_positions?: string[] | null
          share_metrics?: boolean
          team?: string | null
          throws?: string | null
          updated_at?: string
          weight_lb?: number | null
        }
        Update: {
          account_type?: string
          age?: number | null
          avatar_url?: string | null
          bats?: string | null
          created_at?: string
          full_name?: string | null
          grad_year?: number | null
          height_in?: number | null
          hidden_metrics?: string[]
          id?: string
          jersey_number?: string | null
          onboarded?: boolean
          positions?: string[] | null
          profile_visibility?: string
          secondary_positions?: string[] | null
          share_metrics?: boolean
          team?: string | null
          throws?: string | null
          updated_at?: string
          weight_lb?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_announcements: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          team_id: string
          title: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          team_id: string
          title: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          team_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_announcements_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_assignments: {
        Row: {
          assign_all: boolean
          category: string
          coach_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assign_all?: boolean
          category?: string
          coach_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assign_all?: boolean
          category?: string
          coach_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by: string
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_join_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          status: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_join_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          jersey_number: string | null
          position: string | null
          secondary_positions: string[]
          team_id: string
          team_role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jersey_number?: string | null
          position?: string | null
          secondary_positions?: string[]
          team_id: string
          team_role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jersey_number?: string | null
          position?: string | null
          secondary_positions?: string[]
          team_id?: string
          team_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "team_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_message_reactions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_message_reports: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reason: string | null
          reporter_id: string
          resolved: boolean
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reason?: string | null
          reporter_id: string
          resolved?: boolean
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reason?: string | null
          reporter_id?: string
          resolved?: boolean
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "team_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_message_reports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          kind: string
          pinned: boolean
          reply_to: string | null
          team_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string
          pinned?: boolean
          reply_to?: string | null
          team_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string
          pinned?: boolean
          reply_to?: string | null
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "team_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          age_group: string | null
          announcements_enabled: boolean
          assistant_coaches: string[]
          chat_enabled: boolean
          chat_locked: boolean
          city: string | null
          comparisons_visible: boolean
          created_at: string
          description: string | null
          head_coach_name: string | null
          id: string
          join_code: string
          locker_post_policy: string
          logo_url: string | null
          member_list_visible: boolean
          name: string
          organization: string | null
          owner_id: string
          practice_location: string | null
          season: string | null
          state: string | null
          team_level: string | null
          updated_at: string
          visible_metrics: string[]
          website_url: string | null
        }
        Insert: {
          age_group?: string | null
          announcements_enabled?: boolean
          assistant_coaches?: string[]
          chat_enabled?: boolean
          chat_locked?: boolean
          city?: string | null
          comparisons_visible?: boolean
          created_at?: string
          description?: string | null
          head_coach_name?: string | null
          id?: string
          join_code: string
          locker_post_policy?: string
          logo_url?: string | null
          member_list_visible?: boolean
          name: string
          organization?: string | null
          owner_id: string
          practice_location?: string | null
          season?: string | null
          state?: string | null
          team_level?: string | null
          updated_at?: string
          visible_metrics?: string[]
          website_url?: string | null
        }
        Update: {
          age_group?: string | null
          announcements_enabled?: boolean
          assistant_coaches?: string[]
          chat_enabled?: boolean
          chat_locked?: boolean
          city?: string | null
          comparisons_visible?: boolean
          created_at?: string
          description?: string | null
          head_coach_name?: string | null
          id?: string
          join_code?: string
          locker_post_policy?: string
          logo_url?: string | null
          member_list_visible?: boolean
          name?: string
          organization?: string | null
          owner_id?: string
          practice_location?: string | null
          season?: string | null
          state?: string | null
          team_level?: string | null
          updated_at?: string
          visible_metrics?: string[]
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          duration_min: number | null
          id: string
          notes: string | null
          scheduled_date: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          notes?: string | null
          scheduled_date: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          notes?: string | null
          scheduled_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      coach_feedback_for_player: {
        Row: {
          area_to_improve: string | null
          coach_id: string | null
          created_at: string | null
          id: string | null
          player_id: string | null
          player_note: string | null
          recommended_drill: string | null
          strength: string | null
          team_id: string | null
          weekly_focus: string | null
        }
        Insert: {
          area_to_improve?: string | null
          coach_id?: string | null
          created_at?: string | null
          id?: string | null
          player_id?: string | null
          player_note?: string | null
          recommended_drill?: string | null
          strength?: string | null
          team_id?: string | null
          weekly_focus?: string | null
        }
        Update: {
          area_to_improve?: string | null
          coach_id?: string | null
          created_at?: string | null
          id?: string | null
          player_id?: string | null
          player_note?: string | null
          recommended_drill?: string | null
          strength?: string | null
          team_id?: string | null
          weekly_focus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_feedback_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_post_locker: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      can_view_metrics: {
        Args: { _owner: string; _viewer: string }
        Returns: boolean
      }
      find_team_by_join_code: {
        Args: { _code: string }
        Returns: {
          age_group: string
          city: string
          id: string
          logo_url: string
          name: string
          organization: string
          season: string
          state: string
          team_level: string
        }[]
      }
      has_diamond_plus: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_assignment_target: {
        Args: { _assignment_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_coach: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      list_join_requests: {
        Args: { _team_id: string }
        Returns: {
          age: number
          avatar_url: string
          created_at: string
          full_name: string
          id: string
          message: string
          positions: string[]
          status: string
          team_id: string
          user_id: string
        }[]
      }
    }
    Enums: {
      app_role: "player" | "parent" | "coach" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["player", "parent", "coach", "admin"],
    },
  },
} as const
