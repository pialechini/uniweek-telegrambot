export type OperationMode = {
  state: string;
  payload?: object;
} & object;

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
      operation_mode: {
        Row: {
          status: Json;
          user_id: string;
        };
        Insert: {
          status: Json;
          user_id: string;
        };
        Update: {
          status?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "operation_mode_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
