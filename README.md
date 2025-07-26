# CoLink - Coventry University Astana Learning Platform

A fully functional student-professor web platform built with React, Tailwind CSS, and Supabase. CoLink gamifies the learning experience through quests, badges, and interactive features.

## 🌟 Features

### 🎨 Design
- **Coventry Blue (#003A70) and White (#FFFFFF)** color scheme
- Clean, modern academic design with rounded corners and shadows
- Fully responsive mobile-first design
- Smooth animations and transitions

### 🔐 Authentication
- **Supabase Authentication** with email/password login
- Role-based access (Student/Professor)
- Secure user profiles with avatar support

### 🎓 Student Features
- **Interactive Dashboard** with XP tracking and level progression
- **Quest System** with various quest types and difficulty levels
- **Business & Management Quiz** - 4 multiple-choice questions with real-time feedback
- **Badge System** - Earn badges for completing quests and achievements
- **Leaderboard** - Compete with other students
- **Profile Management** - Track progress, badges, and achievements

### 🧑‍🏫 Professor Features
- **Quest Builder** - Create and manage learning quests
- **Analytics Dashboard** - Real-time student engagement metrics
- **Excel Export** - Export analytics data to XLSX format
- **Student Progress Tracking** - Monitor individual and class performance

### 📊 Analytics & Reporting
- Student engagement metrics
- Quest completion rates
- Time-based activity patterns
- Performance analytics with visual charts

### ❓ Support Features
- **FAQ Section** - Comprehensive help documentation
- **Messaging System** - Communication between students and professors
- **Notification System** - Real-time updates and alerts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd colink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Database Setup**
   - Run the SQL schema from `src/lib/supabase-schema.sql` in your Supabase dashboard
   - This creates all necessary tables and sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:5173
   - Choose "I'm a Student" or "I'm a Professor"
   - Use the login system (create accounts as needed)

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # ShadCN UI components
│   ├── BusinessQuiz.tsx # Interactive quiz component
│   ├── BadgeEarnedModal.tsx # Badge celebration modal
│   └── ...
├── pages/               # Route components
│   ├── student/         # Student-specific pages
│   ├── professor/       # Professor-specific pages
│   ├── shared/          # Shared pages
│   └── ...
├── lib/                 # Utilities and services
│   ├── supabaseClient.ts    # Supabase configuration
│   ├── supabaseService.ts   # Database operations
│   └── supabase-schema.sql  # Database schema
└── ...
```

## 🎯 Key Features Walkthrough

### Business & Management Quiz
1. Navigate to Student Dashboard → Quests
2. Click "Start Quiz" on the featured Business & Management Quiz
3. Answer 4 multiple-choice questions with immediate feedback
4. Achieve 70% or higher to earn the badge
5. Celebrate with the animated badge modal

### Professor Analytics
1. Login as a professor
2. Navigate to Analytics Dashboard
3. View student engagement metrics across three tabs:
   - Student Engagement Analysis
   - Quest Performance Metrics  
   - Activity Patterns
4. Export data to Excel using the "Export to Excel" button

### Badge System
- Badges are automatically awarded for achievements
- Students can view their badge collection
- Progress tracking for locked badges
- XP rewards for earning badges

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, ShadCN UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Hooks, Supabase Client
- **Charts**: Recharts
- **Excel Export**: XLSX library
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📱 Responsive Design

CoLink is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Security Features

- Row Level Security (RLS) policies in Supabase
- Role-based access control
- Secure authentication flow
- Data validation and sanitization

## 🎨 Design System

### Colors
- **Primary**: Coventry Blue (#003A70)
- **Secondary**: White (#FFFFFF)
- **Gradients**: Subtle blue gradients for backgrounds

### Typography
- Clean, readable fonts
- Consistent heading hierarchy
- Proper contrast ratios

### Components
- Rounded corners (border-radius)
- Subtle shadows for depth
- Hover states and transitions
- Consistent spacing using Tailwind

## 📈 Future Enhancements

- **Daily Login Rewards** - XP, coins, or badge rewards
- **Notification System** - Real-time push notifications
- **Dark/Light Mode Toggle** - Theme switching
- **Advanced Analytics** - More detailed reporting
- **Mobile App** - React Native version
- **Gamification** - More game-like elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for Coventry University Astana as a learning platform prototype.

## 🆘 Support

For questions or issues:
1. Check the FAQ section in the app
2. Use the messaging system to contact support
3. Review the documentation in this README

---

**CoLink** - Connecting students and professors through gamified learning experiences at Coventry University Astana.
