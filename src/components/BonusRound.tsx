import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Trophy, ArrowRight, Star } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BonusRoundProps {
  questions: Question[];
  incorrectQuestionIndex: number;
  onComplete: (success: boolean) => void;
}

const BonusRound = ({ questions, incorrectQuestionIndex, onComplete }: BonusRoundProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = questions[incorrectQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleComplete = () => {
    onComplete(isCorrect);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader>
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-primary">
              🎯 Bonus Round!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              You got 3 out of 4 questions correct! Try this one more time for a perfect score.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showResult ? (
            <>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="text-lg font-medium mb-4 text-primary">
                  Question {incorrectQuestionIndex + 1}: {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full text-left justify-start p-4 h-auto ${
                        selectedAnswer === index 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary/10 border-primary/20"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-3 font-bold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Submit Answer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                {isCorrect ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {isCorrect ? "Perfect! 🎉" : "Not quite right"}
                </h3>
                {isCorrect ? (
                  <div className="space-y-2">
                    <p className="text-primary font-semibold">
                      Congratulations! You've achieved a perfect score of 4/4!
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm">
                        🏆 Bonus XP earned! Your final score has been upgraded to 100%.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Your final score remains 3/4. Still a great job!
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Correct answer: {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleComplete}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isCorrect ? "Claim Perfect Score!" : "Continue"}
                <Trophy className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusRound;