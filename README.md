# CoLink - Coventry University Astana Learning Platform

A fully functional student-professor web platform for Coventry University Astana, built with React + Tailwind + Supabase.

## 🎨 Design

- **Primary Color**: Coventry Blue (#003A70)
- **Secondary Color**: White (#FFFFFF)
- **Style**: Clean, modern academic design with rounded corners, shadows, and good spacing
- **Responsive**: Mobile-first design that works on all devices

## 🚀 Features

### Landing Page
- Two large buttons: "I'm a Student" and "I'm a Professor"
- Coventry logo in the center
- Beautiful background and layout
- Redirects to login after role selection

### Authentication
- Supabase authentication (email + password)
- Role-based routing (student/professor dashboards)
- Profile management with avatar upload

### Student Dashboard
- **Tabs**: Quests, Profile, Leaderboard
- **Quiz Quest**: Interactive Business & Management quiz
- **Badge System**: Earn badges for completing quests
- **Progress Tracking**: XP, level, and quest completion status

### Quiz System
- **Business & Management Quiz**: 4 multiple-choice questions
- **Interactive Experience**: Real-time feedback on answers
- **Score Tracking**: Final score out of 4
- **Badge Rewards**: Earn "Business Management Expert" badge for high scores

### Professor Dashboard
- **Quest Creation**: Build and save quests to Supabase
- **Analytics**: Real-time student performance tracking
- **Excel Export**: Download analytics as .xlsx files
- **Student Management**: Track engagement and progress

### Badge System
- **Earnable Badges**: Complete quests to unlock badges
- **Animated Modals**: Confetti animation when earning badges
- **Profile Display**: Show earned badges in student profiles

### FAQ Section
- Comprehensive help section
- Common questions about quests, badges, and platform features
- Contact support options

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd colink-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Supabase Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase_setup.sql`
4. This will create all necessary tables and policies

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📊 Database Schema

### Tables
- **quests**: Store quest information created by professors
- **quest_completions**: Track student quest completion and scores
- **badges**: Available badges and their requirements
- **user_badges**: Track which badges each user has earned
- **user_profiles**: User profile information and XP/level data

### Row Level Security (RLS)
- Students can only view and update their own data
- Professors can create quests and view analytics
- All users can view available quests and badges

## 🎯 Demo Credentials

For testing purposes, you can create accounts with these roles:

### Student Account
- Email: student@coventry.ac.uk
- Password: student123
- Role: student

### Professor Account
- Email: professor@coventry.ac.uk
- Password: professor123
- Role: professor

## 🏆 Badge System

### Available Badges
1. **Business Management Expert** 🏆
   - Earned by scoring 3+ on Business & Management Quiz
   - 200 XP reward

2. **First Quest** 🎯
   - Earned by completing any quest
   - 50 XP reward

3. **Quick Learner** ⚡
   - Earned by completing 5 quests in a week
   - 100 XP reward

4. **Team Player** 🤝
   - Earned by participating in 3 group activities
   - 150 XP reward

## 📱 Mobile Responsive

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Excel Export**: xlsx

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions about the platform:
- Check the FAQ section in the app
- Contact the development team
- Review the documentation

---

**Built with ❤️ for Coventry University Astana**
