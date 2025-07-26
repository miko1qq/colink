import { supabase } from './supabaseClient';

// Demo users for testing
export const demoUsers = [
  {
    email: 'student@coventry.edu',
    password: 'student123',
    role: 'student',
    full_name: 'Alex Thompson',
    xp: 1250,
    level: 8
  },
  {
    email: 'professor@coventry.edu', 
    password: 'professor123',
    role: 'professor',
    full_name: 'Dr. Sarah Wilson',
    xp: 0,
    level: 1
  },
  {
    email: 'maria@coventry.edu',
    password: 'maria123',
    role: 'student',
    full_name: 'Maria Garcia',
    xp: 1180,
    level: 7
  },
  {
    email: 'david@coventry.edu',
    password: 'david123',
    role: 'student', 
    full_name: 'David Chen',
    xp: 1050,
    level: 7
  }
];

// Sample quests data
export const sampleQuests = [
  {
    title: 'Business & Management Quiz',
    description: 'Test your knowledge with 4 multiple-choice questions and earn your first badge!',
    instructions: 'Answer all questions to the best of your ability. You need 70% or higher to earn the badge.',
    xp_reward: 150,
    difficulty: 'medium',
    category: 'Quiz',
    time_estimate: '10 mins',
    is_active: true
  },
  {
    title: 'Computer Science Assignment',
    description: 'Complete the data structures programming assignment',
    instructions: 'Implement the required algorithms and submit your code',
    xp_reward: 200,
    difficulty: 'hard',
    category: 'Programming',
    time_estimate: '3 hours',
    is_active: true
  },
  {
    title: 'Virtual Lab Session',
    description: 'Participate in the weekly virtual laboratory session',
    instructions: 'Join the scheduled session and complete all lab exercises',
    xp_reward: 100,
    difficulty: 'easy',
    category: 'Lab',
    time_estimate: '1 hour',
    is_active: true
  }
];

// Sample badges
export const sampleBadges = [
  {
    name: 'Business & Management Expert',
    description: 'Successfully completed the Business & Management quiz with 70% or higher',
    icon: '🎯',
    xp_reward: 150,
    badge_type: 'gold',
    rarity: 'rare'
  },
  {
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: '🏆',
    xp_reward: 50,
    badge_type: 'bronze',
    rarity: 'common'
  },
  {
    name: 'Quick Learner',
    description: 'Complete 5 quests in one week',
    icon: '⚡',
    xp_reward: 100,
    badge_type: 'silver',
    rarity: 'uncommon'
  }
];

// Function to create demo accounts
export async function createDemoAccounts() {
  console.log('Creating demo accounts...');
  
  for (const user of demoUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();

      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping...`);
        continue;
      }

      // Create auth user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        continue;
      }

      if (authUser.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            xp: user.xp,
            level: user.level,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log(`Created user: ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
}

// Function to populate sample data
export async function populateSampleData() {
  console.log('Populating sample data...');

  // Insert sample badges
  try {
    const { error: badgeError } = await supabase
      .from('badges')
      .upsert(sampleBadges, { onConflict: 'name' });

    if (badgeError) {
      console.error('Error inserting badges:', badgeError);
    } else {
      console.log('Sample badges inserted successfully');
    }
  } catch (error) {
    console.error('Error with badges:', error);
  }

  // Insert sample quests
  try {
    const { error: questError } = await supabase
      .from('quests')
      .upsert(sampleQuests, { onConflict: 'title' });

    if (questError) {
      console.error('Error inserting quests:', questError);
    } else {
      console.log('Sample quests inserted successfully');
    }
  } catch (error) {
    console.error('Error with quests:', error);
  }
}

// Function to initialize demo data
export async function initializeDemoData() {
  await createDemoAccounts();
  await populateSampleData();
  console.log('Demo data initialization complete!');
}

// Login helper function for demo
export async function loginDemoUser(userType: 'student' | 'professor') {
  const user = userType === 'student' 
    ? demoUsers.find(u => u.email === 'student@coventry.edu')
    : demoUsers.find(u => u.email === 'professor@coventry.edu');

  if (!user) {
    console.error('Demo user not found');
    return { error: 'Demo user not found' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  return { data, error };
}