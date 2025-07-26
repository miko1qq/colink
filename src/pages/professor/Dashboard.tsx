import { Users, BookOpen, Trophy, TrendingUp, Plus, MessageSquare, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import MotivateStudentsModal from "@/components/MotivateStudentsModal";

const ProfessorDashboard = () => {
  const professorData = {
    name: "Alidar Koyanbaev",
    role: "Professor of Computer Science",
    totalStudents: 147,
    activeQuests: 15,
    badgesAwarded: 89,
    avgEngagement: 78
  };

  const topStudents = [
    { id: 1, name: "Alex Thompson", xp: 1250, level: 8, engagement: 95 },
    { id: 2, name: "Maria Garcia", xp: 1180, level: 7, engagement: 92 },
    { id: 3, name: "David Chen", xp: 1050, level: 7, engagement: 88 }
  ];

  const recentActivity = [
    { id: 1, student: "Alex Thompson", action: "Completed", quest: "CS Assignment", time: "2 hours ago" },
    { id: 2, student: "Maria Garcia", action: "Started", quest: "Virtual Lab", time: "4 hours ago" },
    { id: 3, student: "David Chen", action: "Earned Badge", quest: "Team Player", time: "6 hours ago" }
  ];

  const questStats = [
    { title: "Computer Science Assignment", completion: 85, students: 45 },
    { title: "Virtual Lab Session", completion: 60, students: 38 },
    { title: "Group Discussion Forum", completion: 92, students: 52 }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome, {professorData.name}! 📚
          </h1>
          <p className="text-lg text-muted-foreground">{professorData.role}</p>
          <p className="text-muted-foreground">Manage your courses and track student engagement</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.activeQuests}</div>
              <p className="text-sm text-muted-foreground">Active Quests</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.badgesAwarded}</div>
              <p className="text-sm text-muted-foreground">Badges Awarded</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.avgEngagement}%</div>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-accent/50">
            <TabsTrigger value="quests" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Quest Creation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Link to="/professor/quest-builder">
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">Create New Quest</h3>
                      <p className="text-sm text-muted-foreground">Build interactive learning experiences</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
                             <MotivateStudentsModal>
                 <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                       <MessageSquare className="h-6 w-6 text-white" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-primary">Motivate Students</h3>
                       <p className="text-sm text-muted-foreground">Send encouraging messages</p>
                     </div>
                   </div>
                 </Card>
               </MotivateStudentsModal>
            </div>

            {/* Quest Performance */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quest Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questStats.map((quest, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{quest.title}</p>
                      <span className="text-xs text-muted-foreground">{quest.students} students</span>
                    </div>
                    <Progress value={quest.completion} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{quest.completion}% completion rate</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Students */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Top Performing Students
                  </CardTitle>
                  <Link to="/professor/analytics">
                    <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary hover:text-white">
                      View Full Analytics
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topStudents.map((student, index) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Level {student.level} • {student.xp} XP</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{student.engagement}%</div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Student Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.student}</span> {activity.action.toLowerCase()} 
                            <span className="font-medium"> {activity.quest}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                {professorData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">{professorData.name}</h3>
              <p className="text-lg text-muted-foreground mb-4">{professorData.role}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{professorData.totalStudents}</div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{professorData.activeQuests}</div>
                  <p className="text-sm text-muted-foreground">Quests</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{professorData.badgesAwarded}</div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
                <div className="bg-accent/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{professorData.avgEngagement}%</div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
              
              <Link to="/professor/profile">
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

export default ProfessorDashboard;