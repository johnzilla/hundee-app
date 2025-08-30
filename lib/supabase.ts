import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Please set this environment variable in your .env.local file.'
  );
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please set this environment variable in your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          progress: number;
          emoji: string;
          color: string;
          is_completed: boolean;
          completed_at: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          progress?: number;
          emoji?: string;
          color?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          progress?: number;
          emoji?: string;
          color?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      goal_updates: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          previous_progress: number;
          new_progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          user_id: string;
          previous_progress: number;
          new_progress: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          user_id?: string;
          previous_progress?: number;
          new_progress?: number;
          created_at?: string;
        };
      };
    };
  };
};

export type Goal = Database['public']['Tables']['goals']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type GoalUpdate = Database['public']['Tables']['goal_updates']['Row'];
