export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      identities: {
        Row: {
          academic_orientation: string | null;
          real_name: string | null;
          telegram_username: string | null;
          user_id: string;
        };
        Insert: {
          academic_orientation?: string | null;
          real_name?: string | null;
          telegram_username?: string | null;
          user_id?: string;
        };
        Update: {
          academic_orientation?: string | null;
          real_name?: string | null;
          telegram_username?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      week_schedule: {
        Row: {
          created_at: string;
          even_week_schedule: Json;
          odd_week_schedule: Json;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          even_week_schedule: Json;
          odd_week_schedule: Json;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          even_week_schedule?: Json;
          odd_week_schedule?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "week_schedule_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
