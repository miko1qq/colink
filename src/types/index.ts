export interface User {
  id: string;
  email: string;
  role: 'student' | 'professor';
  name: string;
  xp: number;
  level: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  tag: string;
  professor_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestCompletion {
  id: string;
  quest_id: string;
  student_id: string;
  evidence?: string;
  submitted_at: string;
  approved_at?: string;
  professor_id: string;
  status: 'pending' | 'approved' | 'rejected';
  xp_awarded: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp_threshold: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  quiz_name: string;
  score: number;
  total_questions: number;
  answers: Record<string, number>;
  completed_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  content: string;
  type: 'direct' | 'faq' | 'announcement';
  created_at: string;
  is_read: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface DailyReward {
  id: string;
  user_id: string;
  reward_type: 'xp' | 'badge';
  reward_value: number;
  claimed_at: string;
  streak_count: number;
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  xp: number;
  level: number;
  badge_count: number;
  quest_completions: number;
  rank: number;
}

export interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  totalQuests: number;
  completedQuests: number;
  averageXP: number;
  topPerformers: LeaderboardEntry[];
  questCompletionRate: number;
  engagementScore: number;
}