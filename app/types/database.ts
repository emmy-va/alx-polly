// Database types for Supabase schema

export interface Profile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  allow_multiple_votes: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
  anonymous_user_id?: string;
  created_at: string;
}

export interface PollResult {
  option_id: string;
  option_text: string;
  vote_count: number;
}

// Types for API responses
export interface PollWithOptions extends Poll {
  options: PollOption[];
}

export interface PollWithResults extends Poll {
  results: PollResult[];
  total_votes: number;
}

export interface PollWithOptionsAndResults extends Poll {
  options: PollOption[];
  results: PollResult[];
  total_votes: number;
  user_vote?: Vote;
}

// Database schema type for Supabase
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      polls: {
        Row: Poll;
        Insert: Omit<Poll, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Poll, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      poll_options: {
        Row: PollOption;
        Insert: Omit<PollOption, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PollOption, 'id' | 'poll_id' | 'created_at' | 'updated_at'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'poll_id' | 'option_id' | 'created_at'>>;
      };
    };
    Functions: {
      get_poll_results: {
        Args: { poll_id: string };
        Returns: PollResult[];
      };
    };
  };
};