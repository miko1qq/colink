# 🎯 Coventry University Astana - Gamified Academic Platform

A modern, gamified learning platform built for Coventry University Astana that transforms academic engagement through quests, badges, XP systems, and interactive features.

## 🌟 Features

### 🎮 Gamification System
- **XP & Leveling**: Students earn XP through quest completion and activities
- **Badge System**: Automatic badge awards based on achievements and milestones
- **Daily Rewards**: Login streaks and daily challenges with bonus XP
- **Leaderboards**: Competitive rankings to motivate students
- **Color Match Game**: Mini-game using university colors for bonus XP

### 🎯 Quest Management
- **Professor Quest Creation**: Professors can create and manage learning quests
- **Student Quest Completion**: Students submit evidence and track progress
- **Approval System**: Professors review and approve quest submissions
- **Difficulty Levels**: Easy, Medium, and Hard quests with varying XP rewards

### 🏆 Achievement System
- **Automatic Badge Awards**: XP-based and achievement-based badges
- **Progress Tracking**: Visual progress bars and achievement unlocks
- **Badge Showcase**: Profile display of earned badges and accomplishments

### 📊 Analytics Dashboard
- **Student Analytics**: Track engagement, XP distribution, and activity
- **Performance Metrics**: Quest completion rates and student progress
- **Visual Charts**: Interactive charts using Recharts library
- **Professor Insights**: Monitor student engagement and identify at-risk students

### 🧠 Interactive Learning
- **Business Management Quiz**: 4-question quiz with instant feedback
- **Q&A System**: Community-driven FAQ with voting and categories
- **Real-time Notifications**: Updates on new quests, badges, and messages

### 💬 Communication
- **Messaging System**: Direct communication between students and professors
- **Announcement System**: Broadcast important updates
- **Q&A Community**: Collaborative knowledge sharing

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI Components
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend**: Supabase (Auth + Database + Real-time)
- **Database**: PostgreSQL with Row Level Security
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🎨 Design System

- **Primary Color**: Coventry Blue (#003A70)
- **Secondary**: White (#FFFFFF)
- **Accent**: Light Blue (#F0F4F8)
- **Typography**: Inter/Lato font family
- **No yellow colors** (as per requirements)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun
- Supabase account

### 1. Clone & Install
```bash
git clone <repository-url>
cd coventry-gamified-platform
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql` in Supabase SQL Editor
3. This will create all tables, policies, triggers, and default data

### 4. Development
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── DailyRewards.tsx
│   ├── NotificationDropdown.tsx
│   └── layout/         # Layout components
├── pages/              # Route components
│   ├── student/        # Student-specific pages
│   ├── professor/      # Professor-specific pages
│   ├── shared/         # Shared pages
│   ├── Quiz.tsx        # Business Management Quiz
│   └── QnA.tsx         # Q&A Community
├── lib/                # Utilities and services
│   ├── database.ts     # Supabase service layer
│   ├── supabaseClient.ts
│   └── initializeDatabase.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🎯 Key Features Implementation

### Quest System
- Professors create quests with title, description, XP reward, and difficulty
- Students can view available quests and submit evidence
- Approval workflow with professor review
- Automatic XP awarding upon approval

### Badge System
- 12 default badges ranging from Bronze to Platinum
- Automatic XP-based badge awards (100, 250, 500, 750, 1000, 1500, 2000 XP)
- Special achievement badges (Quiz Master, Streak Champion, etc.)
- Visual badge showcase on student profiles

### Daily Rewards
- 7-day reward cycle with increasing XP
- Login streak tracking
- Color match mini-game
- Weekly challenges

### Analytics
- Real-time student engagement metrics
- Quest completion tracking
- XP distribution analysis
- Active vs inactive student identification

## 🔐 Database Schema

The platform uses a comprehensive PostgreSQL schema with:
- **Row Level Security (RLS)** for data protection
- **Automatic triggers** for XP leveling and badge awards
- **Optimized indexes** for performance
- **Views** for leaderboards and analytics

Key tables:
- `users` - Student and professor profiles
- `quests` - Learning quests created by professors
- `completions` - Student quest submissions and approvals
- `badges` - Badge definitions and user awards
- `quiz_attempts` - Quiz results and scoring
- `daily_rewards` - Daily login rewards and streaks

## 🎮 Gaming Elements

### XP System
- **Quest Completion**: 50-300 XP based on difficulty
- **Quiz Performance**: 25 XP per correct answer
- **Daily Rewards**: 50-150 XP based on streak
- **Color Match Game**: Score-based XP rewards

### Leveling
- **250 XP per level** with automatic level calculation
- **Visual progress bars** showing next level progress
- **Level-based benefits** and recognition

### Achievements
- **Milestone badges** for XP thresholds
- **Special achievement badges** for specific actions
- **Streak rewards** for consistent engagement
- **Community badges** for helping others

## 📱 Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Touch-friendly interactions** for mobile devices
- **Optimized layouts** for tablets and desktops
- **Consistent UX** across all device sizes

## 🔔 Real-time Features

- **Live notifications** for new quests and badges
- **Real-time leaderboard updates**
- **Instant messaging** between users
- **Live quest approval notifications**

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run the `database-schema.sql` script
3. Configure authentication providers if needed
4. Set up Row Level Security policies

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 Testing

### Demo Accounts
Create test accounts for both roles:
- **Student**: student@test.com
- **Professor**: professor@test.com

### Sample Data
The database initialization includes:
- 12 default badges
- Sample quest templates
- FAQ entries
- Notification examples

## 📈 Performance Optimizations

- **Code splitting** with React.lazy()
- **Image optimization** with proper formats
- **Database indexing** for fast queries
- **Caching strategies** for static data
- **Bundle optimization** with Vite

## 🔒 Security Features

- **Row Level Security** on all database tables
- **Authentication** via Supabase Auth
- **Input validation** and sanitization
- **XSS protection** with proper escaping
- **CORS configuration** for API security

## 🎯 Future Enhancements

- **File upload system** for quest evidence
- **Video content integration**
- **Advanced analytics dashboard**
- **Mobile app development**
- **Integration with university systems**
- **AI-powered quest recommendations**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏫 About Coventry University Astana

This platform is designed specifically for Coventry University Astana to enhance student engagement through gamification and modern web technologies.

---

**Built with ❤️ for academic excellence and student engagement**
