import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
}

const Quiz = ({ onComplete, onClose }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary goal of strategic management in business?",
      options: [
        "To maximize short-term profits",
        "To achieve sustainable competitive advantage",
        "To minimize operational costs",
        "To increase market share only"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Which of the following is a key component of the marketing mix?",
      options: [
        "Product, Price, Place, Promotion",
        "Planning, Production, Promotion, Profit",
        "People, Process, Physical evidence, Performance",
        "Strategy, Structure, Systems, Style"
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What does SWOT analysis stand for?",
      options: [
        "Strengths, Weaknesses, Opportunities, Threats",
        "Strategy, Work, Objectives, Tasks",
        "Sales, Workflow, Operations, Technology",
        "Success, Weakness, Organization, Training"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "In business management, what is the main purpose of a mission statement?",
      options: [
        "To describe the company's financial goals",
        "To define the organization's purpose and direction",
        "To list all products and services",
        "To outline employee benefits"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      
      setAnswers([...answers, selectedAnswer]);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed
        const finalScore = isCorrect ? score + 1 : score;
        onComplete(finalScore, questions.length);
      }
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-[#003A70]">
              Business & Management Quiz
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{score} correct</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#003A70]">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-4 ${
                    selectedAnswer === index 
                      ? "bg-[#003A70] text-white" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && (
                      <div className="ml-2">
                        {index === currentQ.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            {!showResult ? (
              <Button
                onClick={handleShowResult}
                disabled={selectedAnswer === null}
                className="bg-[#003A70] hover:bg-[#002A50]"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-[#003A70] hover:bg-[#002A50]"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Finish Quiz <Trophy className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;