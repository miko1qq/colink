import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from '@/types';
import { quizService, authService, userService } from '@/lib/database';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const quizData: QuizQuestion[] = [
  {
    question: "What is a key function of business management?",
    options: ["Cooking", "Leading teams", "Painting", "Playing music"],
    correct: 1
  },
  {
    question: "Which of these is NOT a business objective?",
    options: ["Profit", "Growth", "Sleep", "Market share"],
    correct: 2
  },
  {
    question: "What is SWOT analysis used for?",
    options: ["Dance planning", "Strategic planning", "Hiring artists", "None"],
    correct: 1
  },
  {
    question: "Which department manages staff?",
    options: ["HR", "R&D", "Logistics", "Marketing"],
    correct: 0
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login?role=student');
        return;
      }
      setUser(currentUser);
    };
    loadUser();
  }, [navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    let correctCount = 0;
    quizData.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // Save quiz attempt to database
    if (user) {
      setLoading(true);
      try {
        await quizService.saveQuizAttempt({
          student_id: user.id,
          quiz_name: 'Intro to Business Management',
          score: correctCount,
          total_questions: quizData.length,
          answers: selectedAnswers,
        });

        // Award XP based on performance
        const xpReward = correctCount * 25; // 25 XP per correct answer
        if (xpReward > 0) {
          await userService.addXP(user.id, xpReward);
          toast.success(`Quiz completed! You earned ${xpReward} XP!`);
        }
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        toast.error('Failed to save quiz results');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / quizData.length) * 100;
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    if (percentage >= 40) return 'Not bad, keep practicing! 📚';
    return 'Keep studying and try again! 💪';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground text-lg">Intro to Business Management</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-primary/20 mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {score}/{quizData.length}
                </div>
                <div className="text-xl text-muted-foreground">
                  {Math.round((score / quizData.length) * 100)}% Correct
                </div>
                <div className="text-lg font-medium">
                  {getScoreMessage()}
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-primary font-semibold">
                    XP Earned: {score * 25}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Answer Review</h2>
            {quizData.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <Card key={index} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Your answer:</span>{' '}
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[userAnswer] || 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="font-medium">Correct answer:</span>{' '}
                              <span className="text-green-600">
                                {question.options[question.correct]}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <div className="flex justify-center gap-4">
            <Button onClick={resetQuiz} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={() => navigate('/student/dashboard')} size="lg">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Intro to Business Management Quiz
          </h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Progress value={progress} className="h-3" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {Math.round(progress)}% Complete
          </p>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">
                  {currentQ.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === index 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted-foreground'
                        }`}>
                          {selectedAnswers[currentQuestion] === index && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Quiz Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>Earn 25 XP for each correct answer!</p>
          <p>You can retake this quiz anytime to improve your score.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Quiz;