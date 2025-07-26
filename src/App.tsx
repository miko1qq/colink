import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"; 
import { useUser } from "@/hooks/useUser";

// Pages
import Index from "./pages/Index";
import StudentDashboard from "./pages/student/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";
import Quests from "./pages/student/Quests";
import BusinessQuizPage from "./pages/student/BusinessQuizPage";
import Badges from "./pages/student/Badges";
import Leaderboard from "./pages/student/Leaderboard";
import StudentProfile from "./pages/student/Profile";
import ProfessorProfile from "./pages/professor/Profile";
import Messaging from "./pages/shared/Messaging";
import QuestBuilder from "./pages/professor/QuestBuilder";
import Analytics from "./pages/professor/Analytics";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

