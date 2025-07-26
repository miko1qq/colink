# CoLink - Coventry University Astana Learning Platform

A modern gamified learning platform built with React, TypeScript, and Supabase. CoLink transforms traditional education through interactive quests, achievement badges, and competitive leaderboards.

## 🚀 Features

### For Students
- **Interactive Quests**: Complete academic challenges and earn XP
- **Achievement System**: Unlock badges and track progress
- **Leaderboards**: Compete with peers in friendly competition
- **Progress Tracking**: Monitor learning journey and statistics
- **Real-time Messaging**: Communicate with professors and peers

### For Professors
- **Quest Builder**: Create engaging learning experiences
- **Analytics Dashboard**: Track student engagement and performance
- **Badge Management**: Award achievements and recognize success
- **Student Progress**: Monitor individual and class performance
- **Content Management**: Organize and publish educational content

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

Create the following tables in your Supabase database:

### Users/Profiles Table
```sql
-- Option 1: Using 'users' table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'professor')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Option 2: Using 'profiles' table (recommended)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'professor')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quests Table
```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  xp INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT FALSE,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quest Progress Table
```sql
CREATE TABLE quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not started', 'in progress', 'completed', 'failed')),
  completed_at TIMESTAMP,
  score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Badges Table
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  earned_by UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Setup
Create a storage bucket for avatars:
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `avatars`
3. Set it as public
4. Configure RLS policies as needed

## 🎨 Design System

The platform uses a modern blue and white color scheme:
- **Primary**: #0388fc (Coventry Blue)
- **Background**: #ffffff (White)
- **Accents**: Various shades of the primary color

## 🔐 Authentication

The platform supports:
- Email/password authentication
- Role-based access (Student/Professor)
- Demo accounts for testing
- Profile management with avatar uploads

### Demo Accounts
- **Student**: `student@coventry.edu` / `student123`
- **Professor**: `professor@coventry.edu` / `professor123`

## 📱 Features Overview

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Modern animations and transitions

### Real-time Features
- Live messaging system
- Real-time notifications
- Dynamic leaderboard updates

### Gamification
- XP point system
- Achievement badges
- Progress tracking
- Competitive leaderboards

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── student/        # Student-specific pages
│   ├── professor/      # Professor-specific pages
│   └── shared/         # Shared pages
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── assets/             # Static assets
└── styles/             # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ for Coventry University Astana
