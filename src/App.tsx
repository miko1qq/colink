import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"; 
import TopBar from "@/components/layout/TopBar"; // ✅ top bar
import ChatBot from "@/components/ChatBot";

// Pages
import Index from "./pages/Index";
import StudentDashboard from "./pages/student/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";
import Quests from "./pages/student/Quests";
import Badges from "./pages/student/Badges";
import Leaderboard from "./pages/student/Leaderboard";
import Profile from "./pages/shared/Profile";
import Messaging from "./pages/shared/Messaging";
import QuestBuilder from "./pages/professor/QuestBuilder";
import Analytics from "./pages/professor/Analytics";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import QnA from "./pages/QnA";
console.log("Login component:", Login);

const queryClient = new QueryClient();

const App = () => (
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

              {/* Student */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/quests" element={<Quests />} />
              <Route path="/student/badges" element={<Badges />} />
              <Route path="/student/leaderboard" element={<Leaderboard />} />

              {/* Professor */}
              <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
              <Route path="/professor/quest-builder" element={<QuestBuilder />} />
              <Route path="/professor/analytics" element={<Analytics />} />

              {/* Shared */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/qna" element={<QnA />} />

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

export default App;
