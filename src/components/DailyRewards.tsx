import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Calendar, 
  Star, 
  Trophy, 
  Flame, 
  Zap,
  GamepadIcon,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyRewardService, authService } from '@/lib/database';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DailyReward {
  day: number;
  xp: number;
  claimed: boolean;
  isToday: boolean;
}

const DailyRewards = () => {
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  // Color Match Game State
  const [gameBoard, setGameBoard] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [matches, setMatches] = useState(0);

  const colors = ['#003A70', '#FFFFFF', '#F0F4F8']; // Coventry Blue, White, Light Blue

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadDailyData(currentUser.id);
      }
    };
    loadUser();
  }, []);

  const loadDailyData = async (userId: string) => {
    try {
      const { data: streakData } = await dailyRewardService.getDailyStreak(userId);
      setStreak(streakData || 0);
      
      // Check if can claim today
      const today = new Date().toDateString();
      // In real app, check if already claimed today
      setCanClaim(true); // Simplified for demo
      
      // Generate 7-day reward cycle
      const rewards: DailyReward[] = [];
      for (let i = 1; i <= 7; i++) {
        rewards.push({
          day: i,
          xp: 50 + (i - 1) * 10, // Increasing rewards
          claimed: i <= (streakData || 0) % 7,
          isToday: i === ((streakData || 0) % 7) + 1
        });
      }
      setDailyRewards(rewards);
    } catch (error) {
      console.error('Error loading daily data:', error);
    }
  };

  const claimDailyReward = async () => {
    if (!user || !canClaim) return;
    
    setLoading(true);
    try {
      const { data, error } = await dailyRewardService.claimDailyReward(user.id);
      
      if (error) {
        toast.error(error.message);
      } else if (data) {
        toast.success(`Daily reward claimed! +${data.reward_value} XP`);
        setStreak(data.streak_count);
        setCanClaim(false);
        await loadDailyData(user.id);
      }
    } catch (error) {
      toast.error('Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };

  const initializeGame = () => {
    const board = Array(16).fill(null).map(() => 
      colors[Math.floor(Math.random() * colors.length)]
    );
    setGameBoard(board);
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    setTimeLeft(30);
    setMatches(0);
    setGameScore(0);
    setGameActive(true);
  };

  const handleTileClick = (index: number) => {
    if (!gameActive) return;
    
    if (gameBoard[index] === targetColor) {
      setMatches(prev => prev + 1);
      setGameScore(prev => prev + 10);
      
      // Generate new board
      const newBoard = Array(16).fill(null).map(() => 
        colors[Math.floor(Math.random() * colors.length)]
      );
      setGameBoard(newBoard);
      setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      setGameScore(prev => Math.max(0, prev - 2));
    }
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [timeLeft, gameActive]);

  const endGame = async () => {
    setGameActive(false);
    const xpEarned = Math.floor(gameScore / 2); // Convert score to XP
    
    if (xpEarned > 0 && user) {
      try {
        await dailyRewardService.claimDailyReward(user.id);
        toast.success(`Game complete! Earned ${xpEarned} XP!`);
      } catch (error) {
        console.error('Error awarding game XP:', error);
      }
    }
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 7) return `${streak} day streak! Keep it up!`;
    if (streak < 30) return `Amazing ${streak} day streak! 🔥`;
    return `Incredible ${streak} day streak! You're on fire! 🚀`;
  };

  const getColorName = (color: string) => {
    switch (color) {
      case '#003A70': return 'Coventry Blue';
      case '#FFFFFF': return 'White';
      case '#F0F4F8': return 'Light Blue';
      default: return 'Unknown';
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Daily Login Streak */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Daily Login Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{streak}</div>
            <p className="text-muted-foreground">{getStreakMessage()}</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {dailyRewards.map((reward) => (
              <motion.div
                key={reward.day}
                className={`relative p-3 rounded-lg border-2 text-center ${
                  reward.claimed 
                    ? 'bg-primary/10 border-primary' 
                    : reward.isToday 
                    ? 'bg-orange-50 border-orange-300 border-dashed' 
                    : 'bg-muted border-muted-foreground/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-xs font-medium mb-1">Day {reward.day}</div>
                <div className="text-sm font-bold">{reward.xp} XP</div>
                {reward.claimed && (
                  <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                )}
                {reward.isToday && (
                  <Star className="absolute -top-1 -right-1 h-4 w-4 text-orange-500 bg-white rounded-full" />
                )}
              </motion.div>
            ))}
          </div>

          {canClaim && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Button 
                onClick={claimDailyReward} 
                disabled={loading}
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Gift className="h-4 w-4 mr-2" />
                )}
                Claim Daily Reward
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Color Match Game */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GamepadIcon className="h-5 w-5 text-primary" />
            Color Match Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Match the Coventry University colors to earn bonus XP!
            </p>
            
            <Dialog open={showGame} onOpenChange={setShowGame}>
              <DialogTrigger asChild>
                <Button 
                  onClick={initializeGame}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Play Color Match
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Color Match Challenge</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Game Stats */}
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{gameScore}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{timeLeft}</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{matches}</div>
                      <div className="text-xs text-muted-foreground">Matches</div>
                    </div>
                  </div>

                  {/* Target Color */}
                  {gameActive && (
                    <div className="text-center">
                      <p className="text-sm mb-2">Click all tiles matching:</p>
                      <div className="flex items-center justify-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: targetColor }}
                        />
                        <span className="font-medium">{getColorName(targetColor)}</span>
                      </div>
                    </div>
                  )}

                  {/* Game Board */}
                  <div className="grid grid-cols-4 gap-2">
                    {gameBoard.map((color, index) => (
                      <motion.button
                        key={index}
                        className="w-12 h-12 rounded border-2 border-gray-300 hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => handleTileClick(index)}
                        whileTap={{ scale: 0.95 }}
                        disabled={!gameActive}
                      />
                    ))}
                  </div>

                  {/* Game Over */}
                  {!gameActive && gameBoard.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-2"
                    >
                      <Trophy className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-bold">Game Complete!</h3>
                      <p className="text-sm text-muted-foreground">
                        Final Score: {gameScore} • Matches: {matches}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        XP Earned: {Math.floor(gameScore / 2)}
                      </p>
                      <Button onClick={initializeGame} size="sm">
                        Play Again
                      </Button>
                    </motion.div>
                  )}

                  {/* Instructions */}
                  {gameBoard.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                      <p>🎯 Click tiles matching the target color</p>
                      <p>✅ +10 points for correct matches</p>
                      <p>❌ -2 points for wrong clicks</p>
                      <p>⏱️ 30 seconds to get the highest score!</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div>
              <h4 className="font-medium">Complete 5 Quests</h4>
              <p className="text-sm text-muted-foreground">Progress: 3/5</p>
            </div>
            <div className="text-right">
              <Badge className="bg-primary/20 text-primary">200 XP</Badge>
              <Progress value={60} className="w-20 mt-1" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div>
              <h4 className="font-medium">Take 3 Quizzes</h4>
              <p className="text-sm text-muted-foreground">Progress: 1/3</p>
            </div>
            <div className="text-right">
              <Badge className="bg-primary/20 text-primary">150 XP</Badge>
              <Progress value={33} className="w-20 mt-1" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h4 className="font-medium">Login 7 Days</h4>
              <p className="text-sm text-muted-foreground">Completed! ✅</p>
            </div>
            <div className="text-right">
              <Badge className="bg-green-500 text-white">100 XP</Badge>
              <Progress value={100} className="w-20 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyRewards;