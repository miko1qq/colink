-- CoLink Database Schema for Supabase
-- Updated schema to match requirements exactly

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'professor')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quests table
CREATE TABLE public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 100,
  created_by UUID REFERENCES public.users(id),
  published BOOLEAN DEFAULT false,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quest Progress table
CREATE TABLE public.quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES public.quests(id),
  student_id UUID REFERENCES public.users(id),
  status TEXT CHECK (status IN ('not started', 'in progress', 'completed', 'failed')) DEFAULT 'not started',
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Badges table
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  earned_by UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users: Everyone can read all user profiles
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Quests: Everyone can read published quests, only professors can create/modify
CREATE POLICY "Published quests are viewable by everyone" ON public.quests
  FOR SELECT USING (published = true OR created_by = auth.uid());

CREATE POLICY "Professors can create quests" ON public.quests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'professor'
    )
  );

CREATE POLICY "Professors can update own quests" ON public.quests
  FOR UPDATE USING (created_by = auth.uid());

-- Quest Progress: Students can read/update their own progress, professors can read all
CREATE POLICY "Students can view their own progress" ON public.quest_progress
  FOR SELECT USING (
    student_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'professor'
    )
  );

CREATE POLICY "Students can insert their own progress" ON public.quest_progress
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" ON public.quest_progress
  FOR UPDATE USING (student_id = auth.uid());

-- Badges: Everyone can read badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Professors can create badges" ON public.badges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'professor'
    )
  );

-- Messages: Users can read their own messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update read status of received messages" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid());

-- Insert sample data
INSERT INTO public.badges (name, description, icon_url) VALUES
  ('First Steps', 'Complete your first quest', '🏆'),
  ('Quick Learner', 'Complete 5 quests in one week', '⚡'),
  ('Team Player', 'Participate in 3 group activities', '🤝'),
  ('Academic Excellence', 'Score 90% or higher on 5 quests', '🎓'),
  ('Business Expert', 'Master business and management concepts', '💼');

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();