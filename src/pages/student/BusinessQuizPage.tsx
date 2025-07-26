import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessQuiz from "@/components/BusinessQuiz";
import QuizResults from "@/components/QuizResults";
import BadgeEarnedModal from "@/components/BadgeEarnedModal";
import { supabase } from "@/lib/supabaseClient";
import { 
  questProgressService, 
  badgeService, 
  quizService, 
  profileService 
} from "@/lib/supabaseService";

const BusinessQuizPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'quiz' | 'results'>('quiz');
  const [finalScore, setFinalScore] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // This would be fetched from the database in a real implementation
  const BUSINESS_QUEST_ID = "business-management-quiz";
  const BUSINESS_BADGE_ID = "business-management-expert";

  const businessBadge = {
    id: 1,
    name: "Business & Management Expert",
    description: "Successfully completed the Business & Management quiz with 70% or higher",
    icon: "🎯",
    xpReward: 150,
    type: "gold"
  };

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();
  }, []);

  const handleQuizComplete = async (score: number) => {
    setFinalScore(score);
    setCurrentView('results');
    setLoading(true);

    try {
      if (user) {
        // Save quiz attempt
        await quizService.saveQuizAttempt({
          student_id: user.id,
          quest_id: BUSINESS_QUEST_ID,
          answers: [], // In a real implementation, this would contain the actual answers
          score,
          total_questions: 4,
          completed_at: new Date().toISOString()
        });

        // Mark quest as completed if score >= 70%
        const percentage = (score / 4) * 100;
        if (percentage >= 70) {
          await questProgressService.completeQuest(user.id, BUSINESS_QUEST_ID, score);
        }
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEarnBadge = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Award the badge
      await badgeService.awardBadge(user.id, BUSINESS_BADGE_ID);
      setShowBadgeModal(true);
    } catch (error) {
      console.error('Error awarding badge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/student/quests');
  };

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);
    navigate('/student/quests');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/student/quests')}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quests
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Business & Management Quest
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge and earn your badge!
            </p>
          </div>
        </div>

        {/* Main Content */}
        {currentView === 'quiz' && (
          <BusinessQuiz onComplete={handleQuizComplete} />
        )}

        {currentView === 'results' && (
          <QuizResults
            score={finalScore}
            totalQuestions={4}
            onContinue={handleContinue}
            onEarnBadge={handleEarnBadge}
          />
        )}

        {/* Badge Earned Modal */}
        <BadgeEarnedModal
          isOpen={showBadgeModal}
          onClose={handleCloseBadgeModal}
          badge={businessBadge}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Saving your progress...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessQuizPage;