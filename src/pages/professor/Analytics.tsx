import { ArrowLeft, BarChart3, Users, Clock, TrendingUp, Download, Filter, Calendar } from "lucide-react";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const Analytics = () => {
  const engagementData = [
    { student: "Maria Garcia", engagement: 95, xp: 2450, timeSpent: "45h", questsCompleted: 18, avgScore: 94 },
    { student: "David Chen", engagement: 92, xp: 2380, timeSpent: "42h", questsCompleted: 17, avgScore: 91 },
    { student: "Alex Thompson", engagement: 88, xp: 2250, timeSpent: "38h", questsCompleted: 15, avgScore: 88 },
    { student: "Sarah Ahmed", engagement: 85, xp: 2180, timeSpent: "36h", questsCompleted: 16, avgScore: 85 },
    { student: "James Wilson", engagement: 82, xp: 2120, timeSpent: "34h", questsCompleted: 14, avgScore: 82 },
    { student: "Lisa Park", engagement: 78, xp: 1980, timeSpent: "32h", questsCompleted: 13, avgScore: 79 },
    { student: "Mohammed Ali", engagement: 75, xp: 1890, timeSpent: "28h", questsCompleted: 12, avgScore: 76 },
    { student: "Anna Kowalski", engagement: 72, xp: 1820, timeSpent: "26h", questsCompleted: 11, avgScore: 73 },
    { student: "Ryan Foster", engagement: 68, xp: 1750, timeSpent: "24h", questsCompleted: 10, avgScore: 70 },
    { student: "Emma Davis", engagement: 65, xp: 1680, timeSpent: "22h", questsCompleted: 9, avgScore: 67 }
  ];

  const questAnalytics = [
    {
      title: "Computer Science Assignment",
      completion: 85,
      avgTime: "2.5h",
      avgScore: 88,
      dropOffRate: 15,
      students: 45,
      feedback: "Excellent"
    },
    {
      title: "Virtual Lab Session",
      completion: 92,
      avgTime: "1.2h",
      avgScore: 91,
      dropOffRate: 8,
      students: 38,
      feedback: "Very Good"
    },
    {
      title: "Group Discussion Forum",
      completion: 78,
      avgTime: "45m",
      avgScore: 85,
      dropOffRate: 22,
      students: 52,
      feedback: "Good"
    },
    {
      title: "Research Paper Review",
      completion: 67,
      avgTime: "3.2h",
      avgScore: 82,
      dropOffRate: 33,
      students: 29,
      feedback: "Needs Improvement"
    },
    {
      title: "Algorithm Implementation",
      completion: 89,
      avgTime: "2.8h",
      avgScore: 90,
      dropOffRate: 11,
      students: 41,
      feedback: "Excellent"
    }
  ];

  const timeAnalytics = [
    { hour: "08:00", activity: 12, type: "quests" },
    { hour: "09:00", activity: 28, type: "quests" },
    { hour: "10:00", activity: 45, type: "quests" },
    { hour: "11:00", activity: 52, type: "general" },
    { hour: "12:00", activity: 35, type: "general" },
    { hour: "13:00", activity: 41, type: "quests" },
    { hour: "14:00", activity: 48, type: "quests" },
    { hour: "15:00", activity: 38, type: "general" },
    { hour: "16:00", activity: 29, type: "general" },
    { hour: "17:00", activity: 22, type: "general" }
  ];

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-600 bg-green-100";
    if (engagement >= 80) return "text-blue-600 bg-blue-100";
    if (engagement >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 85) return "text-green-600";
    if (completion >= 70) return "text-blue-600";
    if (completion >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Student data
    const studentData = [
      ['Name', 'XP', 'Time Spent', 'Quests Completed', 'Engagement Score', 'Avg Score'],
      ...engagementData.map(student => [
        student.student, 
        student.xp, 
        student.timeSpent, 
        student.questsCompleted, 
        student.engagement, 
        student.avgScore
      ])
    ];
    
    const ws1 = XLSX.utils.aoa_to_sheet(studentData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Student Analytics');
    
    // Quest completion data
    const questData = [
      ['Quest Title', 'Completion Rate (%)', 'Avg Time', 'Avg Score (%)', 'Drop-off Rate (%)', 'Students Assigned'],
      ...questAnalytics.map(quest => [
        quest.title,
        quest.completion,
        quest.avgTime,
        quest.avgScore,
        quest.dropOffRate,
        quest.students
      ])
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(questData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Quest Analytics');
    
    XLSX.writeFile(wb, `analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/professor/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Analytics Dashboard 📊
              </h1>
              <p className="text-muted-foreground">Track student engagement and quest performance</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="week">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={exportToExcel} className="bg-primary hover:bg-primary-hover">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">147</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">78%</div>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">2.4h</div>
              <p className="text-sm text-muted-foreground">Avg Session Time</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">+12%</div>
              <p className="text-sm text-muted-foreground">Week over Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Student Engagement
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Quest Performance
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Activity Patterns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student Engagement Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of individual student performance and engagement metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((student, index) => (
                    <Card key={index} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{student.student}</h4>
                            <p className="text-sm text-muted-foreground">
                              {student.xp} XP • {student.questsCompleted} quests completed
                            </p>
                          </div>
                          <Badge className={getEngagementColor(student.engagement)}>
                            {student.engagement}% Engaged
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Engagement</div>
                            <Progress value={student.engagement} className="mt-1 h-2" />
                          </div>
                          <div>
                            <div className="text-muted-foreground">Time Spent</div>
                            <div className="font-medium">{student.timeSpent}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Avg Score</div>
                            <div className="font-medium">{student.avgScore}%</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Message</Button>
                            <Button size="sm" variant="outline">Assign Quest</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quests">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quest Performance Metrics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analysis of quest completion rates, average times, and student feedback
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questAnalytics.map((quest, index) => (
                    <Card key={index} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{quest.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {quest.students} students assigned
                            </p>
                          </div>
                          <Badge variant="outline">{quest.feedback}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Completion</div>
                            <div className={`font-bold ${getCompletionColor(quest.completion)}`}>
                              {quest.completion}%
                            </div>
                            <Progress value={quest.completion} className="mt-1 h-2" />
                          </div>
                          <div>
                            <div className="text-muted-foreground">Avg Time</div>
                            <div className="font-medium">{quest.avgTime}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Avg Score</div>
                            <div className="font-medium">{quest.avgScore}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Drop-off Rate</div>
                            <div className="font-medium text-red-600">{quest.dropOffRate}%</div>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Daily Activity Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeAnalytics.map((data, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-muted-foreground">{data.hour}</div>
                        <div className="flex-1">
                          <Progress value={(data.activity / 60) * 100} className="h-4" />
                        </div>
                        <div className="w-12 text-sm font-medium">{data.activity}</div>
                        <Badge variant="outline" className="text-xs">
                          {data.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quest Completion</span>
                        <span className="text-green-600">↑ 12%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Engagement</span>
                        <span className="text-green-600">↑ 8%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Messages Sent</span>
                        <span className="text-blue-600">↑ 5%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Game Participation</span>
                        <span className="text-red-600">↓ 3%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;