-- CoLink Database Schema for Supabase

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'professor')),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quests table
CREATE TABLE public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  time_estimate TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Badges table
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  badge_type TEXT CHECK (badge_type IN ('bronze', 'silver', 'gold', 'diamond', 'platinum')),
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary', 'mythic')),
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Student Quest Progress table
CREATE TABLE public.student_quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id),
  quest_id UUID REFERENCES public.quests(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  score INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, quest_id)
);

-- Student Badges table
CREATE TABLE public.student_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id),
  badge_id UUID REFERENCES public.badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, badge_id)
);

-- Quiz Questions table
CREATE TABLE public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES public.quests(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of answer options
  correct_answer INTEGER NOT NULL, -- Index of correct answer
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quiz Attempts table
CREATE TABLE public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id),
  quest_id UUID REFERENCES public.quests(id),
  answers JSONB NOT NULL, -- Array of selected answers
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Quests: Everyone can read active quests, only professors can create/modify
CREATE POLICY "Active quests are viewable by everyone" ON public.quests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Professors can create quests" ON public.quests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'professor'
    )
  );

-- Student progress: Students can read/update their own progress
CREATE POLICY "Students can view their own progress" ON public.student_quest_progress
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" ON public.student_quest_progress
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can modify their own progress" ON public.student_quest_progress
  FOR UPDATE USING (student_id = auth.uid());

-- Badges: Everyone can read badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

-- Student badges: Students can read their own badges
CREATE POLICY "Students can view their own badges" ON public.student_badges
  FOR SELECT USING (student_id = auth.uid());

-- Insert sample data
INSERT INTO public.badges (name, description, icon, xp_reward, badge_type, rarity) VALUES
  ('Business & Management Expert', 'Successfully completed the Business & Management quiz with 70% or higher', '🎯', 150, 'gold', 'rare'),
  ('First Steps', 'Complete your first quest', '🏆', 50, 'bronze', 'common'),
  ('Quick Learner', 'Complete 5 quests in one week', '⚡', 100, 'silver', 'uncommon'),
  ('Team Player', 'Participate in 3 group activities', '🤝', 150, 'gold', 'rare'),
  ('Academic Excellence', 'Score 90% or higher on 5 quests', '🎓', 200, 'gold', 'rare');

-- Insert sample quest (Business & Management Quiz)
INSERT INTO public.quests (title, description, instructions, xp_reward, difficulty, category, time_estimate) VALUES
  ('Business & Management Quiz', 'Test your knowledge with 4 multiple-choice questions and earn your first badge!', 'Answer all questions to the best of your ability. You need 70% or higher to earn the badge.', 150, 'medium', 'Quiz', '10 mins');

-- Get the quest ID for inserting questions
-- Note: In a real implementation, you'd get this ID from the insert above
-- For now, we'll assume the quest ID is known or retrieved separately

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_quests_updated_at
  BEFORE UPDATE ON public.quests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_student_quest_progress_updated_at
  BEFORE UPDATE ON public.student_quest_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();