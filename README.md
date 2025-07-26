# CoLink - Gamified Learning Platform

CoLink is a gamified educational platform designed for Coventry University Astana, connecting professors and students through an engaging quest-based learning system.

## ✨ Features

### 🎯 For Students
- **Quest System**: Complete quests created by professors to earn XP and badges
- **Real-time Progress Tracking**: Monitor your progress across all quests
- **Badge Collection**: Earn achievements for completing challenges
- **Leaderboard**: Compete with classmates and track your ranking
- **Direct Messaging**: Communicate with professors seamlessly
- **Mobile-First Design**: Optimized for mobile with bottom navigation

### 👩‍🏫 For Professors
- **Quest Builder**: Create engaging quests with descriptions, XP rewards, and deadlines
- **Analytics Dashboard**: Monitor student progress and quest performance
- **Student Communication**: Message students and provide guidance
- **Performance Insights**: Track completion rates, scores, and engagement metrics
- **Real-time Monitoring**: See live updates on student activities

### 🔧 Technical Features
- **Real-time Updates**: Live messaging and progress updates using Supabase Realtime
- **Role-based Access**: Separate interfaces for students and professors
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Secure Authentication**: User management with Supabase Auth
- **Data Analytics**: Comprehensive reporting and insights

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun
- Supabase account and project
- Modern web browser

### 1. Clone and Install
```bash
git clone <repository-url>
cd colink
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the SQL schema from `src/lib/supabase-schema.sql`
4. Enable Row Level Security (RLS) on all tables

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🎮 Demo Access

For quick testing, use these demo accounts:

**Student Demo:**
- Email: `student@coventry.edu`
- Password: `student123`

**Professor Demo:**
- Email: `professor@coventry.edu`
- Password: `professor123`

## 📱 Usage Guide

### For Students
1. **Login**: Use your credentials or demo account
2. **Explore Quests**: Browse available quests from your professors
3. **Start Quests**: Click "Start Quest" to begin any available quest
4. **Complete Tasks**: Follow quest instructions and submit your work
5. **Earn Rewards**: Gain XP and badges for completed quests
6. **Track Progress**: Monitor your achievements in the profile section
7. **Communicate**: Use the messaging system to contact professors

### For Professors
1. **Login**: Access the professor dashboard
2. **Create Quests**: Use the Quest Builder to design learning experiences
3. **Set Parameters**: Add descriptions, XP rewards, deadlines, and requirements
4. **Publish**: Make quests visible to students when ready
5. **Monitor Progress**: Use the Analytics dashboard to track student engagement
6. **Provide Support**: Message students who need assistance
7. **Analyze Performance**: Review completion rates and identify areas for improvement

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **TailwindCSS** for responsive styling
- **Shadcn/ui** for consistent UI components
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **React Query** for efficient data fetching

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **Automatic user profile creation** with database triggers

### Key Design Decisions
- **Role-based routing** for security and user experience
- **Real-time messaging** using Supabase channels
- **Progressive Web App** capabilities for mobile usage
- **Optimistic updates** for better perceived performance

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   └── BottomNavigation.tsx
├── hooks/               # Custom React hooks
│   ├── useUser.ts       # Authentication & user state
│   └── use-toast.ts     # Toast notifications
├── lib/                 # Utilities and configurations
│   ├── supabaseClient.ts     # Supabase configuration
│   ├── supabaseService.ts    # Database operations
│   ├── supabase-schema.sql   # Database schema
│   └── utils.ts         # Helper functions
├── pages/               # Application pages
│   ├── student/         # Student-specific pages
│   ├── professor/       # Professor-specific pages
│   └── shared/          # Shared pages (messaging)
└── App.tsx             # Main application component
```

## 📊 Database Schema

### Core Tables
- **users**: User profiles with roles (student/professor)
- **quests**: Learning activities created by professors
- **quest_progress**: Student progress tracking
- **badges**: Achievement system
- **messages**: Real-time messaging system

### Key Relationships
- Users create quests (professor → quests)
- Students progress through quests (users → quest_progress)
- Messages connect users (users ↔ messages ↔ users)
- Badges are earned by students (users ← badges)

## 🔒 Security Features

### Authentication
- Supabase Auth with email/password
- Automatic user profile creation
- Role-based access control

### Database Security
- Row Level Security (RLS) on all tables
- Students can only access their own data
- Professors can only modify their own quests
- Messages are private between sender and receiver

### API Security
- Environment variables for sensitive data
- Secure database connections
- Input validation and sanitization

## 🚀 Deployment

### Using Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every commit

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features
1. Create components in `src/components/`
2. Add database operations to `src/lib/supabaseService.ts`
3. Create pages in appropriate role folders
4. Update routing in `src/App.tsx`
5. Add database migrations to `src/lib/supabase-schema.sql`

## 🎨 Design System

### Colors
- **Primary**: `#0388FC` (Coventry Blue)
- **Background**: `#FFFFFF` (White)
- **Gradients**: Blue-to-white for visual appeal

### Components
- Consistent spacing using TailwindCSS scale
- Shadcn/ui for accessible, well-tested components
- Framer Motion for smooth interactions
- Mobile-first responsive design

## 📈 Analytics & Monitoring

### Student Analytics
- Quest completion rates
- Average scores and performance
- Time spent on activities
- Badge collection progress

### Professor Analytics
- Quest performance metrics
- Student engagement levels
- Completion rate trends
- Individual student progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Component-based architecture

## 🆘 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
- Ensure `.env` file is in project root
- Restart development server after changes
- Check variable names start with `VITE_`

**Database Connection Issues**
- Verify Supabase URL and key are correct
- Check RLS policies are properly configured
- Ensure database schema is applied

**Authentication Problems**
- Clear browser cache and localStorage
- Check Supabase Auth settings
- Verify user roles are set correctly

**Real-time Features Not Working**
- Confirm Supabase Realtime is enabled
- Check subscription setup in components
- Verify network connectivity

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the Supabase documentation
- Create an issue in the repository
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎓 Built for Coventry University Astana

CoLink is specifically designed to enhance the learning experience at Coventry University Astana, providing a modern, engaging platform that connects professors and students through gamified learning experiences.

---

**Happy Learning! 🚀📚**
