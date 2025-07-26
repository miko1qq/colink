import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

// Types matching the new schema
export interface UserProfile {
  id?: string;
  user_id?: string;
  email: string;
  name?: string | null;
  full_name?: string | null;
  role: 'student' | 'professor';
  avatar_url?: string | null;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  created_by: string | null;
  published: boolean;
  deadline: string | null;
  created_at: string;
}

export interface QuestProgress {
  id: string;
  quest_id: string;
  student_id: string;
  status: 'not started' | 'in progress' | 'completed' | 'failed';
  completed_at: string | null;
  score: number | null;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  earned_by: string[];
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  timestamp: string;
  created_at: string;
  sender?: UserProfile;
  receiver?: UserProfile;
}

// Auth Services
export const authService = {
  async signUp(email: string, password: string, role: 'student' | 'professor', fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { user, profile: null, error: authError };
    }

    // Get the user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If not found in profiles, try users table as fallback
    if (profileError) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return { user, profile: userData, error: userError };
    }

    return { user, profile, error: null };
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// User Services
export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Try profiles table first
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If not found in profiles, try users table as fallback
    if (error) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        return null;
      }

      return userData;
    }

    return data;
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  },

  async getUsersByRole(role: 'student' | 'professor'): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('name');

    if (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }

    return data || [];
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    // Try to update profiles table first
    let { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    // If profiles table doesn't exist or update fails, try users table
    if (error) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (userError) {
        console.error('Error updating user profile:', userError);
        return null;
      }

      return userData;
    }

    return data;
  }
};

// Quest Services
export const questService = {
  async getAllPublishedQuests(): Promise<Quest[]> {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published quests:', error);
      return [];
    }

    return data || [];
  },

  async getQuestsByCreator(creatorId: string): Promise<Quest[]> {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('created_by', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quests by creator:', error);
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

  async createQuest(quest: Omit<Quest, 'id' | 'created_at'>): Promise<Quest | null> {
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
  },

  async updateQuest(questId: string, updates: Partial<Quest>): Promise<Quest | null> {
    const { data, error } = await supabase
      .from('quests')
      .update(updates)
      .eq('id', questId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quest:', error);
      return null;
    }

    return data;
  },

  async deleteQuest(questId: string): Promise<boolean> {
    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', questId);

    if (error) {
      console.error('Error deleting quest:', error);
      return false;
    }

    return true;
  }
};

// Quest Progress Services
export const questProgressService = {
  async getStudentProgress(studentId: string): Promise<QuestProgress[]> {
    const { data, error } = await supabase
      .from('quest_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student progress:', error);
      return [];
    }

    return data || [];
  },

  async getQuestProgress(questId: string, studentId: string): Promise<QuestProgress | null> {
    const { data, error } = await supabase
      .from('quest_progress')
      .select('*')
      .eq('quest_id', questId)
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching quest progress:', error);
      return null;
    }

    return data;
  },

  async getAllQuestProgress(questId: string): Promise<QuestProgress[]> {
    const { data, error } = await supabase
      .from('quest_progress')
      .select('*')
      .eq('quest_id', questId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all quest progress:', error);
      return [];
    }

    return data || [];
  },

  async startQuest(questId: string, studentId: string): Promise<QuestProgress | null> {
    const { data, error } = await supabase
      .from('quest_progress')
      .upsert({
        quest_id: questId,
        student_id: studentId,
        status: 'in progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting quest:', error);
      return null;
    }

    return data;
  },

  async completeQuest(questId: string, studentId: string, score?: number): Promise<QuestProgress | null> {
    const { data, error } = await supabase
      .from('quest_progress')
      .upsert({
        quest_id: questId,
        student_id: studentId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        score
      })
      .select()
      .single();

    if (error) {
      console.error('Error completing quest:', error);
      return null;
    }

    return data;
  },

  async updateQuestProgress(progressId: string, updates: Partial<QuestProgress>): Promise<QuestProgress | null> {
    const { data, error } = await supabase
      .from('quest_progress')
      .update(updates)
      .eq('id', progressId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quest progress:', error);
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

  async getStudentBadges(studentId: string): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .contains('earned_by', [studentId]);

    if (error) {
      console.error('Error fetching student badges:', error);
      return [];
    }

    return data || [];
  },

  async awardBadge(badgeId: string, studentId: string): Promise<boolean> {
    // First get the current badge
    const { data: badge, error: fetchError } = await supabase
      .from('badges')
      .select('earned_by')
      .eq('id', badgeId)
      .single();

    if (fetchError) {
      console.error('Error fetching badge:', fetchError);
      return false;
    }

    // Check if student already has this badge
    if (badge.earned_by.includes(studentId)) {
      return true; // Already has the badge
    }

    // Add student to earned_by array
    const updatedEarnedBy = [...badge.earned_by, studentId];

    const { error } = await supabase
      .from('badges')
      .update({ earned_by: updatedEarnedBy })
      .eq('id', badgeId);

    if (error) {
      console.error('Error awarding badge:', error);
      return false;
    }

    return true;
  }
};

// Message Services
export const messageService = {
  async sendMessage(senderId: string, receiverId: string, message: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  },

  async getConversations(userId: string): Promise<UserProfile[]> {
    // Get all users that have messaged with the current user
    const { data, error } = await supabase
      .from('messages')
      .select(`
        sender_id,
        receiver_id,
        sender:users!messages_sender_id_fkey(id, name, email, role, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, email, role, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    // Extract unique users (excluding current user)
    const uniqueUsers = new Map<string, UserProfile>();
    
    data?.forEach((message: any) => {
      const otherUser = message.sender_id === userId ? message.receiver : message.sender;
      if (otherUser && otherUser.id !== userId) {
        uniqueUsers.set(otherUser.id, otherUser);
      }
    });

    return Array.from(uniqueUsers.values());
  },

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, email, role, avatar_url),
        receiver:users!messages_receiver_id_fkey(id, name, email, role, avatar_url)
      `)
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  },

  async markMessageAsRead(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }

    return true;
  },

  async getUnreadMessageCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error fetching unread message count:', error);
      return 0;
    }

    return count || 0;
  },

  // Real-time subscription for messages
  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return subscription;
  }
};

// Analytics Services
export const analyticsService = {
  async getStudentEngagementData(): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        quest_progress(count)
      `)
      .eq('role', 'student');

    if (error) {
      console.error('Error fetching engagement data:', error);
      return [];
    }

    return data || [];
  },

  async getQuestAnalytics(professorId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('quests')
      .select(`
        *,
        quest_progress(
          status,
          score,
          completed_at,
          student:users(name, email)
        )
      `)
      .eq('created_by', professorId);

    if (error) {
      console.error('Error fetching quest analytics:', error);
      return [];
    }

    return data || [];
  },

  async getStudentStats(studentId: string) {
    // Get completed quests count
    const { count: completedQuests } = await supabase
      .from('quest_progress')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'completed');

    // Get earned badges count
    const { data: badges } = await supabase
      .from('badges')
      .select('earned_by')
      .contains('earned_by', [studentId]);

    const earnedBadges = badges?.length || 0;

    // Get average score
    const { data: scores } = await supabase
      .from('quest_progress')
      .select('score')
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .not('score', 'is', null);

    const averageScore = scores?.length 
      ? scores.reduce((sum, item) => sum + (item.score || 0), 0) / scores.length 
      : 0;

    return {
      completedQuests: completedQuests || 0,
      earnedBadges,
      averageScore: Math.round(averageScore)
    };
  }
};

// Quiz Services
export const quizService = {
  async getAllQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }

    return data || [];
  },

  async getQuizById(id: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }

    return data;
  },

  async saveQuizAttempt(attempt: {
    student_id: string;
    quest_id: string;
    answers: any[];
    score: number;
    total_questions: number;
    completed_at: string;
  }) {
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
  }
};

// Profile Services
export const profileService = {
  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile by user_id:', error);
      return null;
    }

    return data;
  },

  async getProfile(userId: string) {
    // Try profiles table first
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If not found in profiles, try users table
    if (error || !data) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching profile:', userError);
        return null;
      }

      return userData;
    }

    return data;
  }
};