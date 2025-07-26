import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"; 
import { useUser } from "@/hooks/useUser";

// Lazy load pages to prevent issues with complex imports
const Index = React.lazy(() => import("./pages/Index"));
const StudentDashboard = React.lazy(() => import("./pages/student/Dashboard"));
const ProfessorDashboard = React.lazy(() => import("./pages/professor/Dashboard"));
const Quests = React.lazy(() => import("./pages/student/Quests"));
const BusinessQuizPage = React.lazy(() => import("./pages/student/BusinessQuizPage"));
const Badges = React.lazy(() => import("./pages/student/Badges"));
const Leaderboard = React.lazy(() => import("./pages/student/Leaderboard"));
const StudentProfile = React.lazy(() => import("./pages/student/Profile"));
const ProfessorProfile = React.lazy(() => import("./pages/professor/Profile"));
const Messaging = React.lazy(() => import("./pages/shared/Messaging"));
const QuestBuilder = React.lazy(() => import("./pages/professor/QuestBuilder"));
const Analytics = React.lazy(() => import("./pages/professor/Analytics"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'student' | 'professor' 
}) => {
  const { user, profile, loading } = useUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to={`/${profile.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Student Protected Routes */}
                <Route 
                  path="/student/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/quests" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Quests />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/business-quiz" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <BusinessQuizPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/badges" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Badges />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/leaderboard" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/student/profile" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentProfile />
                    </ProtectedRoute>
                  } 
                />

                {/* Professor Protected Routes */}
                <Route 
                  path="/professor/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <ProfessorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/professor/quest-builder" 
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <QuestBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/professor/analytics" 
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/professor/profile" 
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <ProfessorProfile />
                    </ProtectedRoute>
                  } 
                />

                {/* Shared Protected Routes */}
                <Route 
                  path="/messaging" 
                  element={
                    <ProtectedRoute>
                      <Messaging />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

