import { ArrowLeft, Trophy, Lock, Star, Award, Users, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const Badges = () => {
  const badges = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first quest",
      icon: "🏆",
      type: "bronze",
      unlocked: true,
      dateEarned: "2024-01-15",
      xpReward: 50,
      rarity: "Common"
    },
    {
      id: 2,
      name: "Quick Learner",
      description: "Complete 5 quests in one week",
      icon: "⚡",
      type: "silver",
      unlocked: true,
      dateEarned: "2024-01-18",
      xpReward: 100,
      rarity: "Uncommon"
    },
    {
      id: 3,
      name: "Team Player",
      description: "Participate in 3 group activities",
      icon: "🤝",
      type: "gold",
      unlocked: true,
      dateEarned: "2024-01-20",
      xpReward: 150,
      rarity: "Rare"
    },
    {
      id: 4,
      name: "Dedication",
      description: "Log in for 7 consecutive days",
      icon: "📅",
      type: "silver",
      unlocked: true,
      dateEarned: "2024-01-21",
      xpReward: 120,
      rarity: "Uncommon"
    },
    {
      id: 5,
      name: "Academic Excellence",
      description: "Score 90% or higher on 5 quests",
      icon: "🎓",
      type: "gold",
      unlocked: true,
      dateEarned: "2024-01-22",
      xpReward: 200,
      rarity: "Rare"
    },
    {
      id: 6,
      name: "Speed Demon",
      description: "Complete 3 quests in under 1 hour each",
      icon: "🏃",
      type: "silver",
      unlocked: true,
      dateEarned: "2024-01-22",
      xpReward: 130,
      rarity: "Uncommon"
    },
    {
      id: 7,
      name: "Game Master",
      description: "Score 1000+ points in the Color Game",
      icon: "🎮",
      type: "gold",
      unlocked: true,
      dateEarned: "2024-01-23",
      xpReward: 180,
      rarity: "Rare"
    },
    // Locked badges
    {
      id: 8,
      name: "Perfectionist",
      description: "Complete 10 quests with 100% accuracy",
      icon: "💎",
      type: "diamond",
      unlocked: false,
      xpReward: 300,
      rarity: "Legendary",
      progress: 7,
      progressTarget: 10
    },
    {
      id: 9,
      name: "Social Butterfly",
      description: "Send 50 messages to professors and peers",
      icon: "🦋",
      type: "gold",
      unlocked: false,
      xpReward: 160,
      rarity: "Rare",
      progress: 32,
      progressTarget: 50
    },
    {
      id: 10,
      name: "Marathon Runner",
      description: "Complete 25 quests total",
      icon: "🏃‍♂️",
      type: "silver",
      unlocked: false,
      xpReward: 250,
      rarity: "Uncommon",
      progress: 15,
      progressTarget: 25
    },
    {
      id: 11,
      name: "Knowledge Seeker",
      description: "Spend 100 hours total on learning activities",
      icon: "📚",
      type: "diamond",
      unlocked: false,
      xpReward: 400,
      rarity: "Legendary",
      progress: 67,
      progressTarget: 100
    },
    {
      id: 12,
      name: "Coventry Champion",
      description: "Represent Coventry University in external competitions",
      icon: "👑",
      type: "platinum",
      unlocked: false,
      xpReward: 500,
      rarity: "Mythic",
      progress: 0,
      progressTarget: 1
    }
  ];

  const getBadgeTypeColor = (type: string) => {
    switch (type) {
      case "bronze": return "bg-amber-100 text-amber-800 border-amber-300";
      case "silver": return "bg-gray-100 text-gray-800 border-gray-300";
      case "gold": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "diamond": return "bg-blue-100 text-blue-800 border-blue-300";
      case "platinum": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-600";
      case "Uncommon": return "text-green-600";
      case "Rare": return "text-blue-600";
      case "Legendary": return "text-purple-600";
      case "Mythic": return "text-pink-600";
      default: return "text-gray-600";
    }
  };

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const totalXP = unlockedBadges.reduce((sum, badge) => sum + badge.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/student/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Badge Collection 🏆
            </h1>
            <p className="text-muted-foreground">Showcase your achievements and unlock new goals</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{unlockedBadges.length}</div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalXP}</div>
              <p className="text-sm text-muted-foreground">Badge XP</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{lockedBadges.length}</div>
              <p className="text-sm text-muted-foreground">To Unlock</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Earned Badges ({unlockedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <Card key={badge.id} className="shadow-badge hover:shadow-primary/30 transition-all duration-300 border-2 border-primary/20">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 mx-auto bg-gradient-accent rounded-full flex items-center justify-center text-4xl mb-2 animate-float">
                    {badge.icon}
                  </div>
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  
                  <div className="flex justify-center gap-2">
                    <Badge className={`${getBadgeTypeColor(badge.type)} text-xs`}>
                      {badge.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-primary">+{badge.xpReward} XP</div>
                    <div className="text-xs text-muted-foreground">
                      Earned: {new Date(badge.dateEarned!).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-muted-foreground mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Locked Badges ({lockedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="shadow-card hover:shadow-primary/20 transition-all duration-300 opacity-75 border-dashed border-2 border-muted">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl mb-2 relative">
                    <span className="text-2xl opacity-50">{badge.icon}</span>
                    <Lock className="absolute h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg text-muted-foreground">{badge.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                  
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                  </div>
                  
                  {badge.progress !== undefined && badge.progressTarget && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Progress: {badge.progress}/{badge.progressTarget}
                      </div>
                      <Progress value={(badge.progress / badge.progressTarget) * 100} className="h-2" />
                    </div>
                  )}
                  
                  <div className="text-sm font-semibold text-muted-foreground">
                    +{badge.xpReward} XP Reward
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;