import { ArrowLeft, User, Trophy, Target, Clock, Star, Calendar, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const isStudent = location.pathname.includes("student") || !location.pathname.includes("professor");
  
  const userProfile = {
    name: isStudent ? "Alex Thompson" : "Dr. Sarah Wilson",
    role: isStudent ? "Computer Science Student" : "Professor of Computer Science",
    email: isStudent ? "alex.thompson@student.coventry.ac.uk" : "sarah.wilson@coventry.ac.uk",
    memberSince: "September 2023",
    avatar: isStudent ? "AT" : "SW",
    level: isStudent ? 10 : undefined,
    totalXP: isStudent ? 2250 : undefined,
    totalStudents: !isStudent ? 147 : undefined,
    totalQuests: !isStudent ? 25 : undefined
  };

  const studentStats = {
    questsCompleted: 15,
    badgesEarned: 7,
    currentRank: 4,
    weeklyXP: 320,
    totalTimeSpent: "87 hours",
    averageScore: 92,
    streakDays: 12
  };

  const professorStats = {
    studentsManaged: 147,
    questsCreated: 25,
    badgesAwarded: 89,
    avgEngagement: 78,
    totalHours: "340 hours",
    avgCompletion: 85,
    activeCourses: 4
  };

  const recentActivity = isStudent ? [
    { date: "2024-01-23", action: "Completed quest", detail: "Computer Science Assignment", xp: 150 },
    { date: "2024-01-22", action: "Earned badge", detail: "Game Master", xp: 180 },
    { date: "2024-01-22", action: "Reached Level", detail: "Level 10", xp: 200 },
    { date: "2024-01-21", action: "Completed quest", detail: "Group Discussion", xp: 80 },
    { date: "2024-01-20", action: "Earned badge", detail: "Team Player", xp: 150 }
  ] : [
    { date: "2024-01-23", action: "Created quest", detail: "Advanced Algorithms Assignment", students: 25 },
    { date: "2024-01-22", action: "Awarded badge", detail: "Academic Excellence to Maria Garcia", type: "gold" },
    { date: "2024-01-21", action: "Course updated", detail: "Computer Science Fundamentals", changes: 3 },
    { date: "2024-01-20", action: "Analytics reviewed", detail: "Weekly engagement report", insights: 5 },
    { date: "2024-01-19", action: "Message sent", detail: "Feedback to 12 students", responses: 8 }
  ];

  const xpProgress = isStudent ? (userProfile.totalXP! % 300) / 300 * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={isStudent ? "/student/dashboard" : "/professor/dashboard"}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile 👤
            </h1>
            <p className="text-muted-foreground">View your progress and achievements</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="shadow-primary border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                {userProfile.avatar}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-muted-foreground">{userProfile.role}</p>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {userProfile.memberSince}
                </div>
              </div>
              {isStudent && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">Level {userProfile.level}</div>
                  <p className="text-sm text-muted-foreground">{userProfile.totalXP} XP</p>
                  <Progress value={xpProgress} className="w-32 mt-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isStudent ? (
            <>
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{studentStats.questsCompleted}</div>
                  <p className="text-sm text-muted-foreground">Quests Done</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{studentStats.badgesEarned}</div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">#{studentStats.currentRank}</div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{studentStats.totalTimeSpent}</div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <User className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{professorStats.studentsManaged}</div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{professorStats.questsCreated}</div>
                  <p className="text-sm text-muted-foreground">Quests Created</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{professorStats.badgesAwarded}</div>
                  <p className="text-sm text-muted-foreground">Badges Awarded</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{professorStats.avgEngagement}%</div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Detailed Stats */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isStudent ? (
                <>
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Score</span>
                        <span className="font-bold text-primary">{studentStats.averageScore}%</span>
                      </div>
                      <Progress value={studentStats.averageScore} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Weekly XP</span>
                        <span className="font-bold text-primary">{studentStats.weeklyXP}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Study Streak</span>
                        <Badge className="bg-primary">{studentStats.streakDays} days</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Goals Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Level Progress</span>
                          <span>{Math.round(xpProgress)}%</span>
                        </div>
                        <Progress value={xpProgress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Monthly Quest Goal</span>
                          <span>15/20</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Badge Collection</span>
                          <span>7/12</span>
                        </div>
                        <Progress value={58} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Teaching Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-bold text-primary">{professorStats.avgCompletion}%</span>
                      </div>
                      <Progress value={professorStats.avgCompletion} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Courses</span>
                        <span className="font-bold text-primary">{professorStats.activeCourses}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Teaching Hours</span>
                        <Badge className="bg-primary">{professorStats.totalHours}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Impact Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Student Engagement</span>
                          <span>{professorStats.avgEngagement}%</span>
                        </div>
                        <Progress value={professorStats.avgEngagement} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quest Creation Goal</span>
                          <span>25/30</span>
                        </div>
                        <Progress value={83} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Badges Awarded</span>
                          <span>89/100</span>
                        </div>
                        <Progress value={89} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>: {activity.detail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        {isStudent && 'xp' in activity && (
                          <span className="text-primary font-medium">+{activity.xp} XP</span>
                        )}
                        {!isStudent && 'students' in activity && (
                          <span className="text-muted-foreground">{activity.students} students</span>
                        )}
                      </div>
                    </div>
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

export default Profile;