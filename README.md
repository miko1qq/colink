# 🎓 CoLink - Coventry University Astana Student-Professor Platform

A modern, fully interactive student-professor web platform for Coventry University Astana built with React, TypeScript, Tailwind CSS, and Supabase.

![CoLink Platform](https://img.shields.io/badge/Platform-CoLink-003A70?style=for-the-badge&logo=university)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Real--time-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features Overview

### 🎨 Design & UI
- **Coventry Blue (#003A70) & White (#FFFFFF)** color scheme
- Custom Coventry University logo
- Clean, modern academic design with rounded corners and shadows
- Fully responsive mobile design
- Smooth animations and transitions

### 🏠 Landing Page
- Beautiful centered layout with Coventry logo
- Two large interactive buttons: "I'm a Student" and "I'm a Professor"
- Role-based authentication routing
- FAQ access from landing page

### 🔐 Authentication System
- **Supabase-powered** real authentication
- Email + Password login (no signup - admin controlled)
- **Demo accounts** for instant testing:
  - Student: `student@coventry.edu` / `student123`
  - Professor: `professor@coventry.edu` / `professor123`
- One-click demo login buttons
- Profile management with avatar upload

### 🎓 Student Features

#### Dashboard
- Personalized welcome with XP/Level display
- Progress tracking with visual indicators
- Recent badges showcase
- Quick access to all features

#### Quest System
- **Business & Management Quiz** (4 questions, fully functional)
- Dynamic quest loading from Supabase
- Real-time progress tracking
- XP rewards system
- Difficulty levels (Easy/Medium/Hard)

#### Badge System
- **Automated badge earning** after quiz completion (70%+ score)
- Beautiful badge modal with confetti animation
- Badge collection in profile
- XP rewards for achievements

#### Leaderboard
- Real-time student rankings
- XP and level comparisons
- Engagement metrics

### 🧑‍🏫 Professor Features

#### Quest Creation
- **Full Quest Builder** interface
- Multiple quest types (Quiz, Assignment, Lab, etc.)
- Difficulty and XP reward settings
- Student assignment capabilities
- Real-time saving to Supabase

#### Analytics Dashboard
- **Excel Export** functionality (real data)
- Student performance metrics
- Quest completion statistics
- Engagement analytics
- Visual charts and progress tracking

#### Student Management
- Performance overview
- Individual student progress
- Badge awarding capabilities

### 🏆 Interactive Systems

#### Real-time Quiz
- 4 Business & Management questions
- Immediate feedback after each question
- Score tracking and persistence
- Automatic badge awarding at 70%+
- Professional results display

#### Navigation
- Clean bottom navigation for students
- Top navigation bar with Coventry branding
- Breadcrumb navigation
- Mobile-responsive design

### 📊 Data & Backend
- **Supabase database** with comprehensive schema
- Real-time data synchronization
- Row Level Security (RLS) policies
- Automated demo data initialization
- Proper data relationships and constraints

### ❓ FAQ System
- Comprehensive help documentation
- Common questions and answers
- Platform usage guidance
- Contact information

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file is already configured with Supabase credentials:
```
VITE_SUPABASE_URL=https://gbsesttaoxpxxyvpjihz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Initialize Demo Data
- Go to the login page
- Click "Initialize Demo Data" button
- Wait for confirmation
- Use demo login buttons or manual credentials

### 5. Demo Accounts
**Student Account:**
- Email: `student@coventry.edu`
- Password: `student123`

**Professor Account:**
- Email: `professor@coventry.edu`
- Password: `professor123`

## 📖 Usage Guide

### For Students
1. **Login** with student credentials
2. **Explore Dashboard** - see your XP, level, and progress
3. **Take the Quiz** - Go to Quests → Business & Management Quiz
4. **Earn Badges** - Score 70%+ to unlock your first badge
5. **Check Leaderboard** - See how you rank against other students
6. **Manage Profile** - Update avatar and view achievements

### For Professors
1. **Login** with professor credentials
2. **View Analytics** - Monitor student performance
3. **Export Data** - Download Excel reports with real data
4. **Create Quests** - Use the Quest Builder to create new assignments
5. **Track Progress** - Monitor individual student advancement

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **ShadCN/UI** components
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** with Row Level Security
- **Real-time subscriptions**
- **File storage** for avatars

### Tools & Utilities
- **Vite** for build tooling
- **ESLint** for code quality
- **XLSX** for Excel export functionality
- **React Query** for data fetching

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── BusinessQuiz.tsx # Quiz component
│   ├── BadgeEarnedModal.tsx # Badge celebration
│   └── CoventryLogo.tsx # University branding
├── pages/              # Page components
│   ├── student/        # Student-specific pages
│   ├── professor/      # Professor-specific pages
│   └── shared/         # Shared pages
├── lib/                # Utilities and services
│   ├── supabaseClient.ts # Database client
│   ├── supabaseService.ts # Data operations
│   └── demoData.ts     # Demo initialization
└── hooks/              # Custom React hooks
```

## 🎯 Key Features Implemented

### ✅ Fully Functional Systems
- [x] **Complete Authentication** with Supabase
- [x] **Working Quiz System** with real scoring
- [x] **Badge System** with automatic awarding
- [x] **Real Database Integration** with live data
- [x] **Excel Export** with actual analytics
- [x] **Responsive Design** for all devices
- [x] **Professional UI/UX** with Coventry branding

### ✅ Interactive Components
- [x] **Live Quiz** with immediate feedback
- [x] **Badge Earning Modal** with animations
- [x] **Quest Progress Tracking**
- [x] **Real-time Data Updates**
- [x] **Profile Management**
- [x] **Analytics Dashboard**

### ✅ Demo & Testing
- [x] **Demo Account System** for easy testing
- [x] **Sample Data Initialization**
- [x] **One-click Login** for demonstrations
- [x] **Production-ready Build**

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Deployment

The application is built with Vite and can be deployed to any static hosting service:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Traditional hosting**

## 📱 Mobile Support

The platform is fully responsive and provides an excellent experience on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🔒 Security Features

- **Row Level Security (RLS)** in Supabase
- **User authentication** with secure tokens
- **Data validation** on client and server
- **CORS protection**
- **SQL injection prevention**

## 🎓 Educational Purpose

This platform demonstrates:
- Modern web development practices
- Real-time database integration
- User experience design
- Educational technology concepts
- Professional code organization

## 📞 Support & Contact

For questions about the CoLink platform:
- Check the FAQ section in the application
- Review this documentation
- Use the in-app messaging system

---

**Built with ❤️ for Coventry University Astana**

*A modern solution for academic engagement and student-professor interaction.*
