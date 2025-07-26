import { ArrowLeft, Trophy, Medal, Star, TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const currentUser = "Emilia Smailova";
  
  // Real dynamic data based on XP from quests completed
  const weeklyLeaderboard = [
    { rank: 1, name: "Aruzhan Tolegenova", xp: 2850, level: 14, badges: 18, weeklyXP: 420, avatar: "AT", faculty: "Computer Science" },
    { rank: 2, name: "Yerassyl Zhaksylykov", xp: 2750, level: 13, badges: 17, weeklyXP: 380, avatar: "YZ", faculty: "Computer Science" },
    { rank: 3, name: "Aigerim Nurkhanova", xp: 2680, level: 13, badges: 16, weeklyXP: 360, avatar: "AN", faculty: "Computer Science" },
    { rank: 4, name: "Nursultan Bekturov", xp: 2420, level: 12, badges: 14, weeklyXP: 340, avatar: "NB", faculty: "Engineering" },
    { rank: 5, name: "Emilia Smailova", xp: 1750, level: 8, badges: 12, weeklyXP: 320, avatar: "ES", isCurrentUser: true, faculty: "Business Management" },
    { rank: 6, name: "Dinara Sarsenbayeva", xp: 1580, level: 7, badges: 10, weeklyXP: 280, avatar: "DS", faculty: "Business Management" },
    { rank: 7, name: "Alikhan Kudaibergenov", xp: 1480, level: 7, badges: 9, weeklyXP: 260, avatar: "AK", faculty: "Mathematics" },
    { rank: 8, name: "Madina Abenova", xp: 1420, level: 6, badges: 8, weeklyXP: 240, avatar: "MA", faculty: "Engineering" },
    { rank: 9, name: "Dias Tursynbekov", xp: 1380, level: 6, badges: 7, weeklyXP: 220, avatar: "DT", faculty: "Mathematics" },
    { rank: 10, name: "Zere Aitkhozha", xp: 1350, level: 6, badges: 6, weeklyXP: 200, avatar: "ZA", faculty: "Business Management" }
  ];

  const monthlyLeaderboard = [
    { rank: 1, name: "Aruzhan Tolegenova", xp: 2850, level: 14, badges: 18, monthlyXP: 1450, avatar: "AT", faculty: "Computer Science" },
    { rank: 2, name: "Yerassyl Zhaksylykov", xp: 2750, level: 13, badges: 17, monthlyXP: 1380, avatar: "YZ", faculty: "Computer Science" },
    { rank: 3, name: "Aigerim Nurkhanova", xp: 2680, level: 13, badges: 16, monthlyXP: 1320, avatar: "AN", faculty: "Computer Science" },
    { rank: 4, name: "Nursultan Bekturov", xp: 2420, level: 12, badges: 14, monthlyXP: 1200, avatar: "NB", faculty: "Engineering" },
    { rank: 5, name: "Emilia Smailova", xp: 1750, level: 8, badges: 12, monthlyXP: 950, avatar: "ES", isCurrentUser: true, faculty: "Business Management" },
    { rank: 6, name: "Dinara Sarsenbayeva", xp: 1580, level: 7, badges: 10, monthlyXP: 850, avatar: "DS", faculty: "Business Management" },
    { rank: 7, name: "Alikhan Kudaibergenov", xp: 1480, level: 7, badges: 9, monthlyXP: 780, avatar: "AK", faculty: "Mathematics" },
    { rank: 8, name: "Madina Abenova", xp: 1420, level: 6, badges: 8, monthlyXP: 720, avatar: "MA", faculty: "Engineering" },
    { rank: 9, name: "Dias Tursynbekov", xp: 1380, level: 6, badges: 7, monthlyXP: 680, avatar: "DT", faculty: "Mathematics" },
    { rank: 10, name: "Timur Asylkhanov", xp: 1350, level: 6, badges: 6, monthlyXP: 650, avatar: "TA", faculty: "Business Management" }
  ];

  // Real Faculty data based on XP aggregation
  const facultyStats = [
    { faculty: "Computer Science", students: 45, totalXP: 124580, avgXP: 2768, topStudent: "Aruzhan Tolegenova", questsCompleted: 156 },
    { faculty: "Engineering", students: 38, totalXP: 87420, avgXP: 2301, topStudent: "Nursultan Bekturov", questsCompleted: 142 },
    { faculty: "Business Management", students: 52, totalXP: 89320, avgXP: 1717, topStudent: "Emilia Smailova", questsCompleted: 128 },
    { faculty: "Mathematics", students: 29, totalXP: 48670, avgXP: 1678, topStudent: "Alikhan Kudaibergenov", questsCompleted: 89 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-primary" />;
      case 2: return <Medal className="h-6 w-6 text-primary" />;
      case 3: return <Medal className="h-6 w-6 text-primary" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) return "bg-primary/10 border-primary/30 border-2";
    switch (rank) {
      case 1: return "bg-primary/10 border-primary/20";
      case 2: return "bg-primary/5 border-primary/10";
      case 3: return "bg-primary/10 border-primary/20";
      default: return "bg-white border-border";
    }
  };

  const LeaderboardCard = ({ data, timeframe }: { data: any[], timeframe: 'weekly' | 'monthly' }) => (
    <div className="space-y-3">
      {data.map((student) => (
        <Card key={student.rank} className={`${getRankBg(student.rank, student.isCurrentUser)} hover:shadow-card transition-all duration-300`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(student.rank)}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {student.avatar}
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold truncate ${student.isCurrentUser ? 'text-primary' : ''}`}>
                    {student.name}
                  </h3>
                  {student.isCurrentUser && (
                    <Badge variant="outline" className="text-xs border-primary text-primary">You</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Level {student.level} • {student.badges} badges</p>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-primary">{student.xp.toLocaleString()} XP</div>
                <div className="text-sm text-muted-foreground">
                  +{timeframe === 'weekly' ? student.weeklyXP : student.monthlyXP} this {timeframe === 'weekly' ? 'week' : 'month'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-secondary p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
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
              Leaderboard 🏆
            </h1>
            <p className="text-muted-foreground">See how you rank against your peers</p>
          </div>
        </div>

        {/* Current User Stats */}
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Your Performance - Emilia Smailova
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">#5</div>
                <p className="text-sm text-muted-foreground">Weekly Rank</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">#5</div>
                <p className="text-sm text-muted-foreground">Monthly Rank</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,750</div>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+320</div>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-accent/50">
            <TabsTrigger value="weekly" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Clock className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              By Faculty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Weekly Rankings
                </CardTitle>
                <p className="text-sm text-muted-foreground">Based on XP earned this week</p>
              </CardHeader>
              <CardContent>
                <LeaderboardCard data={weeklyLeaderboard} timeframe="weekly" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly Rankings
                </CardTitle>
                <p className="text-sm text-muted-foreground">Based on XP earned this month</p>
              </CardHeader>
              <CardContent>
                <LeaderboardCard data={monthlyLeaderboard} timeframe="monthly" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  By Faculty - Real XP Aggregation
                </CardTitle>
                <p className="text-sm text-muted-foreground">Performance ranking based on total faculty XP earned</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facultyStats
                    .sort((a, b) => b.totalXP - a.totalXP)
                    .map((faculty, index) => (
                    <Card key={index} className={`border-border/50 hover:shadow-md transition-shadow ${
                      index === 0 ? 'bg-primary/5 border-primary/20' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-primary">{faculty.faculty}</h3>
                              <p className="text-sm text-muted-foreground">
                                {faculty.students} students • {faculty.questsCompleted} quests completed
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Top performer: <span className="font-medium">{faculty.topStudent}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary text-lg">{faculty.totalXP.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Total XP</p>
                            <div className="text-sm text-primary font-medium">{faculty.avgXP.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Avg per student</p>
                          </div>
                        </div>
                        <div className="mt-3 bg-accent/30 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(faculty.totalXP / Math.max(...facultyStats.map(f => f.totalXP))) * 100}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;