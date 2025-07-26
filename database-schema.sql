-- Coventry University Astana - Gamified Academic Platform
-- Database Schema for Supabase

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'professor');
CREATE TYPE quest_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE completion_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE badge_type AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE message_type AS ENUM ('direct', 'faq', 'announcement');
CREATE TYPE reward_type AS ENUM ('xp', 'badge');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table
CREATE TABLE public.quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    tag TEXT NOT NULL,
    difficulty quest_difficulty DEFAULT 'medium',
    professor_id UUID REFERENCES public.users(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quest completions table
CREATE TABLE public.completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quest_id UUID REFERENCES public.quests(id) NOT NULL,
    student_id UUID REFERENCES public.users(id) NOT NULL,
    professor_id UUID REFERENCES public.users(id) NOT NULL,
    evidence TEXT,
    status completion_status DEFAULT 'pending',
    xp_awarded INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(quest_id, student_id)
);

-- Badges table
CREATE TABLE public.badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    type badge_type NOT NULL,
    xp_threshold INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table (many-to-many relationship)
CREATE TABLE public.user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    badge_id UUID REFERENCES public.badges(id) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Quiz attempts table
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) NOT NULL,
    quiz_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for Q&A and direct messaging)
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) NOT NULL,
    recipient_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    type message_type DEFAULT 'direct',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily rewards table
CREATE TABLE public.daily_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    reward_type reward_type NOT NULL,
    reward_value INTEGER NOT NULL,
    streak_count INTEGER DEFAULT 1,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table for Q&A section
CREATE TABLE public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ votes table
CREATE TABLE public.faq_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    faq_id UUID REFERENCES public.faqs(id) NOT NULL,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(faq_id, user_id)
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_xp ON public.users(xp DESC);
CREATE INDEX idx_quests_professor ON public.quests(professor_id);
CREATE INDEX idx_quests_active ON public.quests(is_active);
CREATE INDEX idx_completions_student ON public.completions(student_id);
CREATE INDEX idx_completions_professor ON public.completions(professor_id);
CREATE INDEX idx_completions_status ON public.completions(status);
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_daily_rewards_user ON public.daily_rewards(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_popular ON public.faqs(is_popular);

-- Row Level Security (RLS) Policies

-- Users policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Professors can view student profiles" ON public.users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'professor'
    )
);

-- Quests policies
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active quests" ON public.quests FOR SELECT USING (is_active = true);
CREATE POLICY "Professors can manage their own quests" ON public.quests FOR ALL USING (professor_id = auth.uid());

-- Completions policies
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view their own completions" ON public.completions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can create completions" ON public.completions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Professors can view completions for their quests" ON public.completions FOR SELECT USING (professor_id = auth.uid());
CREATE POLICY "Professors can update completions for their quests" ON public.completions FOR UPDATE USING (professor_id = auth.uid());

-- Badges policies
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT TO authenticated;

-- User badges policies
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can view user badges for leaderboard" ON public.user_badges FOR SELECT TO authenticated;

-- Quiz attempts policies
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view their own quiz attempts" ON public.quiz_attempts FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can create quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Professors can view all quiz attempts" ON public.quiz_attempts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'professor'
    )
);

-- Messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid() OR type = 'announcement'
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE USING (recipient_id = auth.uid());

-- Daily rewards policies
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own daily rewards" ON public.daily_rewards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create daily rewards" ON public.daily_rewards FOR INSERT WITH CHECK (user_id = auth.uid());

-- FAQ policies
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view FAQs" ON public.faqs FOR SELECT TO authenticated;
CREATE POLICY "Users can create FAQs" ON public.faqs FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update their own FAQs" ON public.faqs FOR UPDATE USING (author_id = auth.uid());

-- FAQ votes policies
ALTER TABLE public.faq_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view FAQ votes" ON public.faq_votes FOR SELECT TO authenticated;
CREATE POLICY "Users can create FAQ votes" ON public.faq_votes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own FAQ votes" ON public.faq_votes FOR UPDATE USING (user_id = auth.uid());

-- Notifications policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Functions for automatic operations

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = FLOOR(NEW.xp / 250) + 1;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user level
CREATE TRIGGER trigger_update_user_level
    BEFORE UPDATE OF xp ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_level();

-- Function to update quest updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for quests updated_at
CREATE TRIGGER trigger_quests_updated_at
    BEFORE UPDATE ON public.quests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for FAQs updated_at
CREATE TRIGGER trigger_faqs_updated_at
    BEFORE UPDATE ON public.faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check and award badges automatically
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    badge_record RECORD;
BEGIN
    -- Check XP-based badges
    FOR badge_record IN 
        SELECT b.id, b.xp_threshold
        FROM public.badges b
        WHERE b.xp_threshold > 0 
        AND b.xp_threshold <= NEW.xp
        AND NOT EXISTS (
            SELECT 1 FROM public.user_badges ub 
            WHERE ub.user_id = NEW.id AND ub.badge_id = b.id
        )
    LOOP
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (NEW.id, badge_record.id);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically award badges when XP is updated
CREATE TRIGGER trigger_award_badges
    AFTER UPDATE OF xp ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION check_and_award_badges();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, type, xp_threshold) VALUES
('First Steps', 'Complete your first quest', '🎯', 'bronze', 50),
('Getting Started', 'Earn your first 100 XP', '🌟', 'bronze', 100),
('Rising Star', 'Reach 250 XP and show your potential', '⭐', 'silver', 250),
('Dedicated Learner', 'Achieve 500 XP through consistent effort', '📚', 'silver', 500),
('Academic Excellence', 'Reach 750 XP and demonstrate mastery', '🏆', 'gold', 750),
('Knowledge Master', 'Achieve 1000 XP and become a true scholar', '👑', 'gold', 1000),
('Elite Scholar', 'Reach 1500 XP and join the academic elite', '💎', 'platinum', 1500),
('Legend', 'Achieve 2000 XP and become a platform legend', '🚀', 'platinum', 2000),
('Quiz Master', 'Score 100% on any quiz', '🧠', 'gold', 0),
('Streak Champion', 'Maintain a 30-day login streak', '🔥', 'gold', 0),
('Team Player', 'Help other students in Q&A section', '🤝', 'silver', 0),
('Quick Learner', 'Complete 5 quests in one day', '⚡', 'silver', 0)
ON CONFLICT (name) DO NOTHING;

-- Create a view for leaderboard
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    u.id,
    u.name,
    u.xp,
    u.level,
    COUNT(ub.id) as badge_count,
    COUNT(c.id) as quest_completions,
    ROW_NUMBER() OVER (ORDER BY u.xp DESC) as rank
FROM public.users u
LEFT JOIN public.user_badges ub ON u.id = ub.user_id
LEFT JOIN public.completions c ON u.id = c.student_id AND c.status = 'approved'
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.xp, u.level
ORDER BY u.xp DESC;

-- Create a view for analytics
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
    (SELECT COUNT(*) FROM public.users WHERE role = 'student') as total_students,
    (SELECT COUNT(*) FROM public.users WHERE role = 'student' AND updated_at > NOW() - INTERVAL '7 days') as active_students,
    (SELECT COUNT(*) FROM public.quests WHERE is_active = true) as total_quests,
    (SELECT COUNT(*) FROM public.completions WHERE status = 'approved') as completed_quests,
    (SELECT ROUND(AVG(xp)) FROM public.users WHERE role = 'student') as average_xp,
    (SELECT COUNT(DISTINCT student_id) FROM public.completions WHERE status = 'approved' AND approved_at > NOW() - INTERVAL '7 days') as active_quest_takers;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;