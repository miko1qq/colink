import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
  avatar_url?: string;
  member_since: string;
  level?: number;
  total_xp?: number;
  total_students?: number;
  total_quests?: number;
}

export interface UserStats {
  // Student stats
  quests_completed?: number;
  badges_earned?: number;
  current_rank?: number;
  weekly_xp?: number;
  total_time_spent?: string;
  average_score?: number;
  streak_days?: number;
  
  // Professor stats
  students_managed?: number;
  quests_created?: number;
  badges_awarded?: number;
  avg_engagement?: number;
  total_hours?: string;
  avg_completion?: number;
  active_courses?: number;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        setUser(user);
        
        if (user) {
          await fetchUserProfile(user.id);
          await fetchUserStats(user.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          await fetchUserStats(session.user.id);
        } else {
          setProfile(null);
          setStats(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // For now, we'll use mock data since the database structure isn't defined
      // In a real app, you would fetch from your profiles table
      const mockProfile: UserProfile = {
        id: userId,
        name: user?.email?.includes('professor') ? 'Dr. Sarah Wilson' : 'Alex Thompson',
        email: user?.email || '',
        role: user?.email?.includes('professor') ? 'professor' : 'student',
        member_since: '2023-09-01',
        level: user?.email?.includes('professor') ? undefined : 10,
        total_xp: user?.email?.includes('professor') ? undefined : 2250,
        total_students: user?.email?.includes('professor') ? 147 : undefined,
        total_quests: user?.email?.includes('professor') ? 25 : undefined,
      };
      
      setProfile(mockProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // Mock stats data - in a real app, fetch from your stats table
      const isStudent = !user?.email?.includes('professor');
      
      const mockStats: UserStats = isStudent ? {
        quests_completed: 15,
        badges_earned: 7,
        current_rank: 4,
        weekly_xp: 320,
        total_time_spent: '87 hours',
        average_score: 92,
        streak_days: 12,
      } : {
        students_managed: 147,
        quests_created: 25,
        badges_awarded: 89,
        avg_engagement: 78,
        total_hours: '340 hours',
        avg_completion: 85,
        active_courses: 4,
      };
      
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      // In a real app, update the database
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(updates)
      //   .eq('id', user.id);
      
      // For now, just update local state
      setProfile({ ...profile, ...updates });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: data.publicUrl });
      
      return data.publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    stats,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: () => {
      if (user) {
        fetchUserProfile(user.id);
        fetchUserStats(user.id);
      }
    }
  };
};