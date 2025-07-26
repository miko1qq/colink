import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"; 
import TopBar from "@/components/layout/TopBar"; // ✅ top bar
import ChatBot from "@/components/ChatBot";
import { useInitializeDemoData } from "@/hooks/useInitializeDemoData";

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
import Profile from "./pages/shared/Profile";
import Messaging from "./pages/shared/Messaging";
import QuestBuilder from "./pages/professor/QuestBuilder";
import Analytics from "./pages/professor/Analytics";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
console.log("Login component:", Login);

const queryClient = new QueryClient();

const App = () => {
  // Initialize demo data on app start
  useInitializeDemoData();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
          {/* 🔝 Верхний бар всегда закреплён */}
          <TopBar />

          <div className="pt-16"> {/* отступ сверху под TopBar */}
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Student */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/quests" element={<Quests />} />
              <Route path="/student/business-quiz" element={<BusinessQuizPage />} />
              <Route path="/student/badges" element={<Badges />} />
              <Route path="/student/leaderboard" element={<Leaderboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />

              {/* Professor */}
              <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
              <Route path="/professor/quest-builder" element={<QuestBuilder />} />
              <Route path="/professor/analytics" element={<Analytics />} />
              <Route path="/professor/profile" element={<ProfessorProfile />} />

              {/* Shared */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/messaging" element={<Messaging />} />

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

            {/* 🤖 Чат-бот виден всегда */}
            <ChatBot />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
// TODO: Add chatbot UI

