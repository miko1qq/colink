import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BusinessQuizProps {
  onComplete: (score: number) => void;
}

const BusinessQuiz = ({ onComplete }: BusinessQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: Question[] = [
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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-primary border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl text-primary">
              Business & Management Quiz
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showResult ? (
            <>
              <div>
                <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full text-left justify-start p-4 h-auto ${
                        selectedAnswer === index 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-primary/10"
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
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
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
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {currentQ.explanation}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-primary font-medium">
                    Correct answer: {String.fromCharCode(65 + currentQ.correctAnswer)}. {currentQ.options[currentQ.correctAnswer]}
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleContinue}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {currentQuestion < questions.length - 1 ? "Continue" : "View Results"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessQuiz;