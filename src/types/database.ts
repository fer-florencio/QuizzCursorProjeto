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
      leaderboard_entries: {
        Row: {
          id: string;
          player_name: string;
          score: number;
          level: string;
          correct_answers: number;
          total_questions: number;
          percentage: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          score: number;
          level: string;
          correct_answers: number;
          total_questions: number;
          percentage: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          score?: number;
          level?: string;
          correct_answers?: number;
          total_questions?: number;
          percentage?: number;
          created_at?: string;
        };
        Relationships: [];
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
