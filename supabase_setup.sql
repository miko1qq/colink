-- CoLink Platform Database Setup
-- Run this in your Supabase SQL editor

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50),
  xp_reward INTEGER DEFAULT 100,
  time_estimate VARCHAR(50),
  due_date DATE,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  assigned_students VARCHAR(100) DEFAULT 'all',
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quest_completions table
CREATE TABLE IF NOT EXISTS quest_completions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quest_id INTEGER REFERENCES quests(id),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER,
  total_questions INTEGER,
  UNIQUE(user_id, quest_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  requirements TEXT,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  badge_id INTEGER REFERENCES badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default badges
INSERT INTO badges (name, description, icon, requirements, xp_reward) VALUES
('Business Management Expert', 'Successfully completed the Business & Management quiz with excellent performance!', '🏆', 'Score 3+ on Business & Management Quiz', 200),
('First Quest', 'Completed your first quest on the platform', '🎯', 'Complete any quest', 50),
('Quick Learner', 'Completed 5 quests in a week', '⚡', 'Complete 5 quests within 7 days', 100),
('Team Player', 'Participated in 3 group activities', '🤝', 'Complete 3 group quests', 150);

-- Create RLS policies
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Quest policies
CREATE POLICY "Quests are viewable by everyone" ON quests FOR SELECT USING (true);
CREATE POLICY "Professors can create quests" ON quests FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'professor'
  )
);

-- Quest completion policies
CREATE POLICY "Users can view their own completions" ON quest_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completions" ON quest_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badge policies
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);

-- User badge policies
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User profile policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();