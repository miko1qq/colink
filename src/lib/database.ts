import { supabase } from './supabaseClient';
import { 
  User, 
  Quest, 
  QuestCompletion, 
  Badge, 
  UserBadge, 
  QuizAttempt, 
  Message, 
  DailyReward,
  LeaderboardEntry,
  AnalyticsData 
} from '../types';

// Auth Functions
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email: string, password: string, name: string, role: 'student' | 'professor') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (data.user && !error) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
        role,
        xp: 0,
        level: 1,
      });
    }

    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      return profile;
    }
    return null;
  },
};

// Quest Functions
export const questService = {
  async createQuest(quest: Omit<Quest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quests')
      .insert(quest)
      .select()
      .single();
    return { data, error };
  },

  async getQuests(professorId?: string) {
    let query = supabase.from('quests').select('*');
    
    if (professorId) {
      query = query.eq('professor_id', professorId);
    }
    
    query = query.eq('is_active', true).order('created_at', { ascending: false });
    
    const { data, error } = await query;
    return { data, error };
  },

  async getQuestById(questId: string) {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();
    return { data, error };
  },

  async updateQuest(questId: string, updates: Partial<Quest>) {
    const { data, error } = await supabase
      .from('quests')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', questId)
      .select()
      .single();
    return { data, error };
  },

  async deleteQuest(questId: string) {
    const { data, error } = await supabase
      .from('quests')
      .update({ is_active: false })
      .eq('id', questId);
    return { data, error };
  },
};

// Quest Completion Functions
export const completionService = {
  async submitQuest(questId: string, studentId: string, evidence?: string) {
    const { data: quest } = await questService.getQuestById(questId);
    if (!quest) return { data: null, error: { message: 'Quest not found' } };

    const { data, error } = await supabase
      .from('completions')
      .insert({
        quest_id: questId,
        student_id: studentId,
        professor_id: quest.professor_id,
        evidence,
        status: 'pending',
        xp_awarded: 0,
      })
      .select()
      .single();
    return { data, error };
  },

  async approveCompletion(completionId: string) {
    // Get completion and quest details
    const { data: completion } = await supabase
      .from('completions')
      .select('*, quests(*)')
      .eq('id', completionId)
      .single();

    if (!completion) return { data: null, error: { message: 'Completion not found' } };

    // Update completion status
    const { data, error } = await supabase
      .from('completions')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        xp_awarded: completion.quests.xp_reward,
      })
      .eq('id', completionId)
      .select()
      .single();

    if (!error) {
      // Award XP to student
      await userService.addXP(completion.student_id, completion.quests.xp_reward);
    }

    return { data, error };
  },

  async getCompletions(filters: { studentId?: string; professorId?: string; status?: string }) {
    let query = supabase
      .from('completions')
      .select('*, quests(*), users(name)');

    if (filters.studentId) query = query.eq('student_id', filters.studentId);
    if (filters.professorId) query = query.eq('professor_id', filters.professorId);
    if (filters.status) query = query.eq('status', filters.status);

    query = query.order('submitted_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },
};

// User Functions
export const userService = {
  async addXP(userId: string, xpAmount: number) {
    const { data: user } = await supabase
      .from('users')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (!user) return { error: { message: 'User not found' } };

    const newXP = user.xp + xpAmount;
    const newLevel = Math.floor(newXP / 250) + 1; // 250 XP per level

    const { data, error } = await supabase
      .from('users')
      .update({ 
        xp: newXP, 
        level: newLevel,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId)
      .select()
      .single();

    // Check for new badges
    if (newLevel > user.level) {
      await badgeService.checkAndAwardBadges(userId, newXP, newLevel);
    }

    return { data, error };
  },

  async getLeaderboard(limit: number = 10): Promise<{ data: LeaderboardEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        xp,
        level,
        user_badges(count)
      `)
      .eq('role', 'student')
      .order('xp', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };

    const leaderboard: LeaderboardEntry[] = data?.map((user, index) => ({
      user_id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      badge_count: user.user_badges?.[0]?.count || 0,
      quest_completions: 0, // Will be populated separately if needed
      rank: index + 1,
    })) || [];

    return { data: leaderboard, error: null };
  },
};

// Badge Functions
export const badgeService = {
  async createBadge(badge: Omit<Badge, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('badges')
      .insert(badge)
      .select()
      .single();
    return { data, error };
  },

  async getBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('xp_threshold', { ascending: true });
    return { data, error };
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    return { data, error };
  },

  async awardBadge(userId: string, badgeId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
      })
      .select()
      .single();
    return { data, error };
  },

  async checkAndAwardBadges(userId: string, xp: number, level: number) {
    const { data: badges } = await this.getBadges();
    const { data: userBadges } = await this.getUserBadges(userId);
    
    if (!badges || !userBadges) return;

    const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
    
    for (const badge of badges) {
      if (!earnedBadgeIds.includes(badge.id) && xp >= badge.xp_threshold) {
        await this.awardBadge(userId, badge.id);
      }
    }
  },
};

// Quiz Functions
export const quizService = {
  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        ...attempt,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  async getQuizAttempts(studentId?: string) {
    let query = supabase
      .from('quiz_attempts')
      .select('*, users(name)')
      .order('completed_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;
    return { data, error };
  },
};

// Analytics Functions
export const analyticsService = {
  async getAnalyticsData(): Promise<{ data: AnalyticsData | null; error: any }> {
    try {
      // Get total and active students
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('id, xp, updated_at')
        .eq('role', 'student');

      if (studentsError) return { data: null, error: studentsError };

      const totalStudents = students?.length || 0;
      const activeStudents = students?.filter(s => {
        const lastActive = new Date(s.updated_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActive > weekAgo;
      }).length || 0;

      // Get quest statistics
      const { data: quests } = await supabase
        .from('quests')
        .select('id')
        .eq('is_active', true);

      const { data: completions } = await supabase
        .from('completions')
        .select('id')
        .eq('status', 'approved');

      const totalQuests = quests?.length || 0;
      const completedQuests = completions?.length || 0;

      // Calculate average XP
      const averageXP = totalStudents > 0 
        ? students.reduce((sum, s) => sum + s.xp, 0) / totalStudents 
        : 0;

      // Get top performers
      const { data: topPerformers } = await userService.getLeaderboard(5);

      const analyticsData: AnalyticsData = {
        totalStudents,
        activeStudents,
        totalQuests,
        completedQuests,
        averageXP: Math.round(averageXP),
        topPerformers: topPerformers || [],
        questCompletionRate: totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0,
        engagementScore: totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0,
      };

      return { data: analyticsData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Message Functions
export const messageService = {
  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'is_read'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        is_read: false,
      })
      .select()
      .single();
    return { data, error };
  },

  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(name)')
      .or(`recipient_id.eq.${userId},type.eq.announcement`)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
    return { data, error };
  },
};

// Daily Rewards Functions
export const dailyRewardService = {
  async claimDailyReward(userId: string) {
    const today = new Date().toDateString();
    
    // Check if already claimed today
    const { data: existingReward } = await supabase
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .gte('claimed_at', today)
      .single();

    if (existingReward) {
      return { data: null, error: { message: 'Already claimed today' } };
    }

    // Get user's current streak
    const { data: lastReward } = await supabase
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .single();

    let streakCount = 1;
    if (lastReward) {
      const lastClaimDate = new Date(lastReward.claimed_at);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastClaimDate.toDateString() === yesterday.toDateString()) {
        streakCount = lastReward.streak_count + 1;
      }
    }

    // Calculate reward based on streak
    const xpReward = Math.min(50 + (streakCount - 1) * 10, 150); // Max 150 XP

    const { data, error } = await supabase
      .from('daily_rewards')
      .insert({
        user_id: userId,
        reward_type: 'xp',
        reward_value: xpReward,
        streak_count: streakCount,
      })
      .select()
      .single();

    if (!error) {
      await userService.addXP(userId, xpReward);
    }

    return { data, error };
  },

  async getDailyStreak(userId: string) {
    const { data, error } = await supabase
      .from('daily_rewards')
      .select('streak_count')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .single();

    return { data: data?.streak_count || 0, error };
  },
};