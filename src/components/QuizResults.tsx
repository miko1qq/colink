import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Target, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onContinue: () => void;
  onEarnBadge: () => void;
}

const QuizResults = ({ score, totalQuestions, onContinue, onEarnBadge }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70; // 70% passing grade

  const getScoreColor = () => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 50) return "Not bad! 👍";
    return "Keep practicing! 💪";
  };

  const handleContinue = () => {
    if (passed) {
      onEarnBadge(); // Show badge modal
    }
    onContinue();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-primary border-2 border-primary/20 text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-accent rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl text-primary mb-2">
            Quiz Complete!
          </CardTitle>
          <p className="text-muted-foreground">
            Business & Management Quiz Results
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {score}/{totalQuestions}
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-semibold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <p className="text-lg text-muted-foreground">
                {getScoreMessage()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Your Score</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Results Details */}
          <div className="bg-gradient-secondary rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>

          {/* XP and Badge Info */}
          {passed && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Quest Completed!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've earned 150 XP and unlocked the Business & Management badge!
              </p>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {passed ? "Claim Your Badge!" : "Continue Learning"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>

          {!passed && (
            <p className="text-sm text-muted-foreground">
              You need 70% or higher to earn the badge. Try again to improve your score!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;