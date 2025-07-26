import { badgeService } from './database';

export const initializeDatabase = async () => {
  try {
    // Create default badges
    const defaultBadges = [
      {
        name: 'First Steps',
        description: 'Complete your first quest',
        icon: '🎯',
        type: 'bronze' as const,
        xp_threshold: 50,
      },
      {
        name: 'Getting Started',
        description: 'Earn your first 100 XP',
        icon: '🌟',
        type: 'bronze' as const,
        xp_threshold: 100,
      },
      {
        name: 'Rising Star',
        description: 'Reach 250 XP and show your potential',
        icon: '⭐',
        type: 'silver' as const,
        xp_threshold: 250,
      },
      {
        name: 'Dedicated Learner',
        description: 'Achieve 500 XP through consistent effort',
        icon: '📚',
        type: 'silver' as const,
        xp_threshold: 500,
      },
      {
        name: 'Academic Excellence',
        description: 'Reach 750 XP and demonstrate mastery',
        icon: '🏆',
        type: 'gold' as const,
        xp_threshold: 750,
      },
      {
        name: 'Knowledge Master',
        description: 'Achieve 1000 XP and become a true scholar',
        icon: '👑',
        type: 'gold' as const,
        xp_threshold: 1000,
      },
      {
        name: 'Elite Scholar',
        description: 'Reach 1500 XP and join the academic elite',
        icon: '💎',
        type: 'platinum' as const,
        xp_threshold: 1500,
      },
      {
        name: 'Legend',
        description: 'Achieve 2000 XP and become a platform legend',
        icon: '🚀',
        type: 'platinum' as const,
        xp_threshold: 2000,
      },
      {
        name: 'Quiz Master',
        description: 'Score 100% on any quiz',
        icon: '🧠',
        type: 'gold' as const,
        xp_threshold: 0, // Special achievement badge
      },
      {
        name: 'Streak Champion',
        description: 'Maintain a 30-day login streak',
        icon: '🔥',
        type: 'gold' as const,
        xp_threshold: 0, // Special achievement badge
      },
      {
        name: 'Team Player',
        description: 'Help other students in Q&A section',
        icon: '🤝',
        type: 'silver' as const,
        xp_threshold: 0, // Special achievement badge
      },
      {
        name: 'Quick Learner',
        description: 'Complete 5 quests in one day',
        icon: '⚡',
        type: 'silver' as const,
        xp_threshold: 0, // Special achievement badge
      }
    ];

    // Create badges if they don't exist
    for (const badge of defaultBadges) {
      try {
        await badgeService.createBadge(badge);
        console.log(`Created badge: ${badge.name}`);
      } catch (error) {
        console.log(`Badge ${badge.name} may already exist`);
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Sample quest data for professors to create
export const sampleQuests = [
  {
    title: 'Introduction to Database Design',
    description: 'Create an ER diagram for a university management system. Include entities for Students, Courses, Professors, and Enrollments with appropriate relationships.',
    xp_reward: 150,
    tag: 'database',
    difficulty: 'medium' as const,
    is_active: true,
  },
  {
    title: 'Business Process Analysis',
    description: 'Analyze a real-world business process and identify areas for improvement. Submit a detailed report with recommendations.',
    xp_reward: 200,
    tag: 'business',
    difficulty: 'hard' as const,
    is_active: true,
  },
  {
    title: 'Programming Fundamentals Quiz',
    description: 'Complete the online quiz covering basic programming concepts including variables, loops, and functions.',
    xp_reward: 75,
    tag: 'programming',
    difficulty: 'easy' as const,
    is_active: true,
  },
  {
    title: 'Research Paper Review',
    description: 'Read and summarize a recent research paper in your field. Provide critical analysis and discuss potential applications.',
    xp_reward: 180,
    tag: 'research',
    difficulty: 'medium' as const,
    is_active: true,
  },
  {
    title: 'Team Collaboration Project',
    description: 'Work with a team of 3-4 students to develop a solution for a given problem. Document your collaboration process.',
    xp_reward: 250,
    tag: 'teamwork',
    difficulty: 'hard' as const,
    is_active: true,
  }
];