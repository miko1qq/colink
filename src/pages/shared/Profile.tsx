import { ArrowLeft, User, Trophy, Target, Clock, Star, Calendar, TrendingUp, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { AvatarUploader } from "@/components/AvatarUploader";

interface ActivityItem {
  date: string;
  action: string;
  detail: string;
  xp?: number;
  students?: number;
  type?: string;
  changes?: number;
  insights?: number;
  responses?: number;
}

const Profile = () => {
  const location = useLocation();
  const { user, profile, stats, loading, error, uploadAvatar } = useUser();
  
  // Determine role from location path or profile
  const isStudent = profile?.role === 'student' || 
    (location.pathname.includes("student") && !location.pathname.includes("professor"));

  // Mock recent activity data - in a real app, this would come from the API
  const recentActivity: ActivityItem[] = isStudent ? [
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

  // Calculate XP progress for students
  const xpProgress = profile?.total_xp ? (profile.total_xp % 300) / 300 * 100 : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to={isStudent ? "/student/dashboard" : "/professor/dashboard"}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load profile: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-secondary p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to={isStudent ? "/student/dashboard" : "/professor/dashboard"}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No profile data available. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
            <p className="text-muted-foreground">View and manage your profile</p>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="shadow-primary border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <AvatarUploader
                  currentAvatarUrl={profile.avatar_url}
                  userName={profile.name}
                  onUpload={uploadAvatar}
                  loading={loading}
                />
              </div>
              
              {/* Profile Info */}
              <div className="lg:col-span-1 space-y-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground capitalize">{profile.role}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(profile.member_since).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Level Info for Students */}
              {isStudent && profile.level && (
                <div className="lg:col-span-1 text-center lg:text-right">
                  <div className="text-2xl font-bold text-primary">Level {profile.level}</div>
                  <p className="text-sm text-muted-foreground">{profile.total_xp} XP</p>
                  <div className="mt-2">
                    <Progress value={xpProgress} className="w-full lg:w-32 lg:ml-auto" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(xpProgress)}% to next level
                    </p>
                  </div>
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
                  <div className="text-2xl font-bold text-primary">
                    {stats?.quests_completed || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Quests Done</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.badges_earned || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    #{stats?.current_rank || 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.total_time_spent || '0h'}
                  </div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <User className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.students_managed || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Students</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.quests_created || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Quests Created</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.badges_awarded || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Badges Awarded</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stats?.avg_engagement || 0}%
                  </div>
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
                        <span className="font-bold text-primary">
                          {stats?.average_score || 0}%
                        </span>
                      </div>
                      <Progress value={stats?.average_score || 0} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Weekly XP</span>
                        <span className="font-bold text-primary">
                          {stats?.weekly_xp || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Study Streak</span>
                        <Badge className="bg-primary">
                          {stats?.streak_days || 0} days
                        </Badge>
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
                          <span>{stats?.quests_completed || 0}/20</span>
                        </div>
                        <Progress value={((stats?.quests_completed || 0) / 20) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Badge Collection</span>
                          <span>{stats?.badges_earned || 0}/12</span>
                        </div>
                        <Progress value={((stats?.badges_earned || 0) / 12) * 100} className="h-2" />
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
                        <span className="font-bold text-primary">
                          {stats?.avg_completion || 0}%
                        </span>
                      </div>
                      <Progress value={stats?.avg_completion || 0} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Courses</span>
                        <span className="font-bold text-primary">
                          {stats?.active_courses || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Teaching Hours</span>
                        <Badge className="bg-primary">
                          {stats?.total_hours || '0h'}
                        </Badge>
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
                          <span>{stats?.avg_engagement || 0}%</span>
                        </div>
                        <Progress value={stats?.avg_engagement || 0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quest Creation Goal</span>
                          <span>{stats?.quests_created || 0}/30</span>
                        </div>
                        <Progress value={((stats?.quests_created || 0) / 30) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Badges Awarded</span>
                          <span>{stats?.badges_awarded || 0}/100</span>
                        </div>
                        <Progress value={((stats?.badges_awarded || 0) / 100) * 100} className="h-2" />
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
                        {isStudent && activity.xp && (
                          <span className="text-primary font-medium">+{activity.xp} XP</span>
                        )}
                        {!isStudent && activity.students && (
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