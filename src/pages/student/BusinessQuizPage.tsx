import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessQuiz from "@/components/BusinessQuiz";
import QuizResults from "@/components/QuizResults";
import BonusRound from "@/components/BonusRound";
import BadgeEarnedModal from "@/components/BadgeEarnedModal";
import { supabase } from "@/lib/supabaseClient";
import { 
  questProgressService, 
  badgeService, 
  quizService
} from "@/lib/supabaseService";

const BusinessQuizPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'quiz' | 'bonus' | 'results'>('quiz');
  const [finalScore, setFinalScore] = useState(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);
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

  // Business quiz questions for bonus round
  const quizQuestions = [
    {
      id: 1,
      question: "What is the primary purpose of a business plan?",
      options: [
        "To secure funding from investors",
        "To provide a roadmap for business operations and growth",
        "To comply with legal requirements",
        "To impress potential customers"
      ],
      correctAnswer: 1,
      explanation: "A business plan serves as a comprehensive roadmap that guides business operations, strategic decisions, and growth planning."
    },
    {
      id: 2,
      question: "Which of the following is NOT one of the four Ps of marketing?",
      options: [
        "Product",
        "Price",
        "Promotion",
        "Performance"
      ],
      correctAnswer: 3,
      explanation: "The four Ps of marketing are Product, Price, Place, and Promotion. Performance is not one of the traditional marketing mix elements."
    },
    {
      id: 3,
      question: "What does SWOT analysis stand for?",
      options: [
        "Strengths, Weaknesses, Opportunities, Threats",
        "Systems, Workflow, Organization, Technology",
        "Sales, Workforce, Operations, Targets",
        "Strategic, Workload, Objectives, Timeline"
      ],
      correctAnswer: 0,
      explanation: "SWOT analysis is a strategic planning technique that evaluates Strengths, Weaknesses, Opportunities, and Threats of a business or project."
    },
    {
      id: 4,
      question: "What is the break-even point in business?",
      options: [
        "The point where a company goes public",
        "The point where total revenue equals total costs",
        "The maximum profit a company can achieve",
        "The point where a company must close down"
      ],
      correctAnswer: 1,
      explanation: "The break-even point is where total revenue equals total costs, meaning the business is not making a profit or loss."
    }
  ];

  const handleQuizComplete = async (score: number, incorrectQuestionIndexes?: number[]) => {
    setFinalScore(score);
    setIncorrectQuestions(incorrectQuestionIndexes || []);
    
    // Check if student got exactly 3/4 (75%) and has one wrong answer - eligible for bonus round
    if (score === 3 && incorrectQuestionIndexes && incorrectQuestionIndexes.length === 1) {
      setCurrentView('bonus');
    } else {
      setCurrentView('results');
      await saveQuizResults(score);
    }
  };

  const handleBonusComplete = async (success: boolean) => {
    const finalBonusScore = success ? 4 : finalScore; // Perfect score if bonus successful
    setFinalScore(finalBonusScore);
    setCurrentView('results');
    await saveQuizResults(finalBonusScore);
  };

  const saveQuizResults = async (score: number) => {
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

        {currentView === 'bonus' && (
          <BonusRound
            questions={quizQuestions}
            incorrectQuestionIndex={incorrectQuestions[0]}
            onComplete={handleBonusComplete}
          />
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