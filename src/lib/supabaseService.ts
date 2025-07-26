import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

// Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'professor';
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  time_estimate?: string;
  due_date?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  badge_type: 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
  requirements?: any;
  created_at: string;
}

export interface StudentQuestProgress {
  id: string;
  student_id: string;
  quest_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress_percentage: number;
  score?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  quest_id: string;
  answers: number[];
  score: number;
  total_questions: number;
  completed_at: string;
}

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  async createProfile(user: User, role: 'student' | 'professor'): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  },

  async addXP(userId: string, xpToAdd: number): Promise<Profile | null> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    const newXP = profile.xp + xpToAdd;
    const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP

    return this.updateProfile(userId, { 
      xp: newXP, 
      level: newLevel 
    });
  }
};

// Quest Services
export const questService = {
  async getAllQuests(): Promise<Quest[]> {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests:', error);
      return [];
    }

    return data || [];
  },

  async getQuestById(questId: string): Promise<Quest | null> {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (error) {
      console.error('Error fetching quest:', error);
      return null;
    }

    return data;
  },

  async createQuest(quest: Omit<Quest, 'id' | 'created_at' | 'updated_at'>): Promise<Quest | null> {
    const { data, error } = await supabase
      .from('quests')
      .insert(quest)
      .select()
      .single();

    if (error) {
      console.error('Error creating quest:', error);
      return null;
    }

    return data;
  }
};

// Badge Services
export const badgeService = {
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }

    return data || [];
  },

  async getStudentBadges(studentId: string): Promise<StudentBadge[]> {
    const { data, error } = await supabase
      .from('student_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching student badges:', error);
      return [];
    }

    return data || [];
  },

  async awardBadge(studentId: string, badgeId: string): Promise<StudentBadge | null> {
    // Check if student already has this badge
    const { data: existing } = await supabase
      .from('student_badges')
      .select('*')
      .eq('student_id', studentId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) {
      console.log('Student already has this badge');
      return existing;
    }

    // Award the badge
    const { data, error } = await supabase
      .from('student_badges')
      .insert({
        student_id: studentId,
        badge_id: badgeId
      })
      .select()
      .single();

    if (error) {
      console.error('Error awarding badge:', error);
      return null;
    }

    // Add XP for earning the badge
    const badge = await supabase
      .from('badges')
      .select('xp_reward')
      .eq('id', badgeId)
      .single();

    if (badge.data) {
      await profileService.addXP(studentId, badge.data.xp_reward);
    }

    return data;
  }
};

// Quest Progress Services
export const questProgressService = {
  async getStudentProgress(studentId: string, questId: string): Promise<StudentQuestProgress | null> {
    const { data, error } = await supabase
      .from('student_quest_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('quest_id', questId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching quest progress:', error);
      return null;
    }

    return data;
  },

  async getAllStudentProgress(studentId: string): Promise<StudentQuestProgress[]> {
    const { data, error } = await supabase
      .from('student_quest_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching student progress:', error);
      return [];
    }

    return data || [];
  },

  async startQuest(studentId: string, questId: string): Promise<StudentQuestProgress | null> {
    const { data, error } = await supabase
      .from('student_quest_progress')
      .upsert({
        student_id: studentId,
        quest_id: questId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting quest:', error);
      return null;
    }

    return data;
  },

  async completeQuest(
    studentId: string, 
    questId: string, 
    score?: number
  ): Promise<StudentQuestProgress | null> {
    const { data, error } = await supabase
      .from('student_quest_progress')
      .upsert({
        student_id: studentId,
        quest_id: questId,
        status: 'completed',
        progress_percentage: 100,
        score,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error completing quest:', error);
      return null;
    }

    // Add XP for completing the quest
    const quest = await questService.getQuestById(questId);
    if (quest) {
      await profileService.addXP(studentId, quest.xp_reward);
    }

    return data;
  }
};

// Quiz Services
export const quizService = {
  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt | null> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert(attempt)
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz attempt:', error);
      return null;
    }

    return data;
  },

  async getStudentQuizAttempts(studentId: string, questId: string): Promise<QuizAttempt[]> {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quest_id', questId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }

    return data || [];
  }
};

// Analytics Services
export const analyticsService = {
  async getStudentEngagementData(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        student_quest_progress(count),
        student_badges(count)
      `)
      .eq('role', 'student');

    if (error) {
      console.error('Error fetching engagement data:', error);
      return [];
    }

    return data || [];
  },

  async getQuestAnalytics(): Promise<any[]> {
    const { data, error } = await supabase
      .from('quests')
      .select(`
        *,
        student_quest_progress(
          status,
          score,
          completed_at
        )
      `)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching quest analytics:', error);
      return [];
    }

    return data || [];
  }
};