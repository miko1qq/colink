import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { authService, userService, analyticsService, type UserProfile } from '@/lib/supabaseService';

export interface UserStats {
  // Student stats
  completedQuests?: number;
  earnedBadges?: number;
  averageScore?: number;
  
  // Professor stats
  studentsManaged?: number;
  questsCreated?: number;
  badgesAwarded?: number;
  avgEngagement?: number;
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
        setLoading(true);
        const { user, error: authError } = await authService.getCurrentUser();
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
      const userProfile = await userService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      if (!profile) return;
      
      if (profile.role === 'student') {
        const studentStats = await analyticsService.getStudentStats(userId);
        setStats(studentStats);
      } else {
        // For professors, we'll implement basic stats
        const mockStats: UserStats = {
          studentsManaged: 147,
          questsCreated: 25,
          badgesAwarded: 89,
          avgEngagement: 78,
        };
        setStats(mockStats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      const updatedProfile = await userService.updateUserProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
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

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setStats(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
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
    signOut,
    refetch: () => {
      if (user) {
        fetchUserProfile(user.id);
        fetchUserStats(user.id);
      }
    }
  };
};