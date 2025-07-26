import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Target, 
  Trophy, 
  TrendingUp,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { 
  analyticsService, 
  questService, 
  userService, 
  type Quest 
} from "@/lib/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import BottomNavigation from "@/components/BottomNavigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface QuestAnalytics {
  quest: Quest;
  totalStudents: number;
  completedStudents: number;
  averageScore: number;
  completionRate: number;
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  questsCompleted: number;
  averageScore: number;
  lastActivity: string;
}

const Analytics = () => {
  const { user, profile } = useUser();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [questAnalytics, setQuestAnalytics] = useState<QuestAnalytics[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalQuests: 0,
    totalStudents: 0,
    averageCompletion: 0,
    totalXPAwarded: 0
  });

  useEffect(() => {
    if (!user || !profile || profile.role !== 'professor') return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Get professor's quests with progress data
        const questsWithProgress = await analyticsService.getQuestAnalytics(user.id);
        
        // Process quest analytics
        const processedQuests: QuestAnalytics[] = questsWithProgress.map(quest => {
          const progressData = quest.quest_progress || [];
          const completedProgress = progressData.filter((p: any) => p.status === 'completed');
          
          const averageScore = completedProgress.length > 0 
            ? completedProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / completedProgress.length
            : 0;

          return {
            quest,
            totalStudents: progressData.length,
            completedStudents: completedProgress.length,
            averageScore: Math.round(averageScore),
            completionRate: progressData.length > 0 ? (completedProgress.length / progressData.length) * 100 : 0
          };
        });

        setQuestAnalytics(processedQuests);

        // Get all students and their progress
        const students = await userService.getUsersByRole('student');
        const studentProgressData: StudentProgress[] = [];

        for (const student of students) {
          const stats = await analyticsService.getStudentStats(student.id);
          studentProgressData.push({
            id: student.id,
            name: student.name || student.email,
            email: student.email,
            questsCompleted: stats.completedQuests,
            averageScore: stats.averageScore,
            lastActivity: student.created_at // This would be better with actual last activity timestamp
          });
        }

        setStudentProgress(studentProgressData);

        // Calculate total stats
        const totalQuests = processedQuests.length;
        const totalStudents = students.length;
        const totalCompletions = processedQuests.reduce((sum, q) => sum + q.completedStudents, 0);
        const totalAttempts = processedQuests.reduce((sum, q) => sum + q.totalStudents, 0);
        const averageCompletion = totalAttempts > 0 ? (totalCompletions / totalAttempts) * 100 : 0;
        const totalXPAwarded = processedQuests.reduce((sum, q) => 
          sum + (q.quest.xp * q.completedStudents), 0);

        setTotalStats({
          totalQuests,
          totalStudents,
          averageCompletion: Math.round(averageCompletion),
          totalXPAwarded
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, profile, toast]);

  if (!profile || profile.role !== 'professor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Access denied. This page is only available to professors.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const questCompletionData = questAnalytics.map(q => ({
    name: q.quest.title.length > 15 ? q.quest.title.substring(0, 15) + '...' : q.quest.title,
    completed: q.completedStudents,
    total: q.totalStudents,
    rate: q.completionRate
  }));

  const scoreDistributionData = questAnalytics
    .filter(q => q.averageScore > 0)
    .map(q => ({
      name: q.quest.title.length > 15 ? q.quest.title.substring(0, 15) + '...' : q.quest.title,
      score: q.averageScore
    }));

  const COLORS = ['#0388FC', '#0EA5E9', '#06B6D4', '#10B981', '#84CC16'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white pb-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/professor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Analytics Dashboard 📊</h1>
            <p className="text-muted-foreground">Monitor student progress and quest performance</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalStats.totalQuests}</div>
              <p className="text-sm text-muted-foreground">Total Quests</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalStats.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalStats.averageCompletion}%</div>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{totalStats.totalXPAwarded}</div>
              <p className="text-sm text-muted-foreground">XP Awarded</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quests">Quest Performance</TabsTrigger>
            <TabsTrigger value="students">Student Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-6">
            {/* Quest Completion Chart */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle>Quest Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                {questCompletionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={questCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#0388FC" name="Completed" />
                      <Bar dataKey="total" fill="#E2E8F0" name="Total Attempts" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No quest data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quest List with Analytics */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle>Quest Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {questAnalytics.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No quests created yet</p>
                        <Link to="/professor/quest-builder">
                          <Button className="mt-4 bg-primary hover:bg-primary/90">
                            Create Your First Quest
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      questAnalytics.map((analytics) => (
                        <Card key={analytics.quest.id} className="border border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{analytics.quest.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                  {analytics.quest.description}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Students:</span>
                                    <div className="font-medium">{analytics.totalStudents}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Completed:</span>
                                    <div className="font-medium text-green-600">{analytics.completedStudents}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Completion Rate:</span>
                                    <div className="font-medium">{Math.round(analytics.completionRate)}%</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Avg Score:</span>
                                    <div className="font-medium">{analytics.averageScore}%</div>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{Math.round(analytics.completionRate)}%</span>
                                  </div>
                                  <Progress value={analytics.completionRate} className="h-2" />
                                </div>
                              </div>
                              
                              <Badge 
                                variant={analytics.quest.published ? "default" : "secondary"}
                                className={analytics.quest.published ? "bg-green-100 text-green-800" : ""}
                              >
                                {analytics.quest.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Student Progress Chart */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {scoreDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#0388FC" name="Average Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No student performance data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student List */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {studentProgress.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No student data available</p>
                      </div>
                    ) : (
                      studentProgress.map((student) => (
                        <Card key={student.id} className="border border-border/50">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{student.name}</h4>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Completed:</span>
                                    <span className="ml-1 font-medium">{student.questsCompleted}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Avg Score:</span>
                                    <span className="ml-1 font-medium">{student.averageScore}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Top Performing Quests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questAnalytics
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .slice(0, 5)
                      .map((analytics, index) => (
                        <div key={analytics.quest.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{analytics.quest.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {analytics.completedStudents}/{analytics.totalStudents} completed
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {Math.round(analytics.completionRate)}%
                          </Badge>
                        </div>
                      ))}
                    {questAnalytics.length === 0 && (
                      <p className="text-muted-foreground text-sm">No quest data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questAnalytics
                      .filter(q => q.completionRate < 50 && q.totalStudents > 0)
                      .slice(0, 5)
                      .map((analytics) => (
                        <div key={analytics.quest.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{analytics.quest.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Low completion rate
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {Math.round(analytics.completionRate)}%
                          </Badge>
                        </div>
                      ))}
                    {questAnalytics.filter(q => q.completionRate < 50 && q.totalStudents > 0).length === 0 && (
                      <p className="text-muted-foreground text-sm">All quests performing well!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation userRole="professor" />
    </div>
  );
};

export default Analytics;