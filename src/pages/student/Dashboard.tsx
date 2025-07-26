import { Trophy, Target, Users, ArrowRight, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const studentData = {
    name: "Emilia Smailova",
    course: "Foundation Business Management",
    xp: 1250,
    level: 8,
    nextLevelXP: 1500,
    badges: 12,
    questsCompleted: 23,
    rank: 5
  };

  const recentBadges = [
    { id: 1, name: "First Quest", icon: "🏆", type: "bronze" },
    { id: 2, name: "Team Player", icon: "🤝", type: "silver" },
    { id: 3, name: "Quick Learner", icon: "⚡", type: "gold" }
  ];

  const activeQuests = [
    { id: 1, title: "Complete Computer Science Assignment", xp: 150, progress: 75 },
    { id: 2, title: "Attend Virtual Lab Session", xp: 100, progress: 0 },
    { id: 3, title: "Participate in Group Discussion", xp: 80, progress: 50 }
  ];

  const xpProgress = (studentData.xp / studentData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {studentData.name}! 🎯
          </h1>
          <p className="text-lg text-muted-foreground">{studentData.course}</p>
          <p className="text-muted-foreground">Ready to continue your learning journey?</p>
        </div>

        {/* XP Progress Section */}
        <Card className="shadow-primary border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Level {studentData.level} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{studentData.xp} XP</span>
                <span>{studentData.nextLevelXP} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                {studentData.nextLevelXP - studentData.xp} XP until Level {studentData.level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.questsCompleted}</div>
              <p className="text-sm text-muted-foreground">Quests Done</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">#{studentData.rank}</div>
              <p className="text-sm text-muted-foreground">Leaderboard</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">85%</div>
              <p className="text-sm text-muted-foreground">Game Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-accent/50">
            <TabsTrigger value="quests" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Quests
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Quests */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Active Quests
                  </CardTitle>
                  <Link to="/student/quests">
                    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary hover:text-white">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeQuests.map((quest) => (
                    <div key={quest.id} className="p-4 bg-accent/30 rounded-lg space-y-2 hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{quest.title}</h4>
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                          {quest.xp} XP
                        </span>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{quest.progress}% complete</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Badges */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Recent Badges
                  </CardTitle>
                  <Link to="/student/badges">
                    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary hover:text-white">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {recentBadges.map((badge) => (
                      <div key={badge.id} className="text-center group">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                          {badge.icon}
                        </div>
                        <p className="text-xs font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{badge.type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-4">#{studentData.rank}</div>
              <h3 className="text-2xl font-bold text-primary mb-2">Your Current Rank</h3>
              <p className="text-muted-foreground mb-6">Keep completing quests to climb higher!</p>
              <Link to="/student/leaderboard">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">{studentData.name}</h3>
              <p className="text-lg text-muted-foreground mb-4">{studentData.course}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{studentData.level}</div>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{studentData.xp}</div>
                  <p className="text-sm text-muted-foreground">XP</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{studentData.questsCompleted}</div>
                  <p className="text-sm text-muted-foreground">Quests</p>
                </div>
              </div>
              
              <Link to="/student/profile">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default StudentDashboard;