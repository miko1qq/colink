import { useState, useEffect, useRef } from "react";
import { User, Trophy, Target, Clock, Calendar, Star, Upload, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { profileService, questProgressService, badgeService } from "@/lib/supabaseService";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { user, profile, uploadAvatar } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [completedQuests, setCompletedQuests] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Student data - this would come from Supabase
  const studentData = {
    full_name: "Emilia Smailova",
    email: "emilia.smailova@student.coventry.edu.kz",
    course: "Foundation Business Management",
    level: 8,
    xp: 1250,
    nextLevelXP: 1500,
    badges: 12,
    questsCompleted: 23,
    rank: 5,
    joinedDate: "June 2025", // Fixed from 2024
    timeSpent: "47h 32m",
    avatar: "/src/assets/logo.png"
  };

  const recentBadges = [
    { id: 1, name: "Business Expert", icon: "🎯", type: "gold", earnedAt: "2 days ago" },
    { id: 2, name: "Quick Learner", icon: "⚡", type: "silver", earnedAt: "1 week ago" },
    { id: 3, name: "Team Player", icon: "🤝", type: "silver", earnedAt: "2 weeks ago" },
    { id: 4, name: "First Steps", icon: "🏆", type: "bronze", earnedAt: "1 month ago" },
  ];

  const questHistory = [
    { id: 1, title: "Business & Management Quiz", xp: 150, completedAt: "2 days ago", score: "4/4" },
    { id: 2, title: "Introduction to Economics", xp: 100, completedAt: "1 week ago", score: "8/10" },
    { id: 3, title: "Marketing Fundamentals", xp: 120, completedAt: "2 weeks ago", score: "9/10" },
    { id: 4, title: "Financial Basics", xp: 80, completedAt: "3 weeks ago", score: "7/8" },
  ];

  useEffect(() => {
    setLoading(false);
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setAvatarUploading(true);
    
    try {
      await uploadAvatar(file);
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  const xpProgress = (studentData.xp / studentData.nextLevelXP) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Student Profile</h1>
          <p className="text-muted-foreground">Track your academic progress and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="text-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20 transition-all group-hover:border-primary/40">
                    <AvatarImage 
                      src={profile?.avatar_url || studentData.avatar} 
                      alt={profile?.full_name || studentData.full_name} 
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                      {(profile?.full_name || studentData.full_name).split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </>
                  )}
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{studentData.full_name}</h2>
                    <p className="text-lg text-muted-foreground">{studentData.course}</p>
                    <p className="text-sm text-muted-foreground">{studentData.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="font-medium">Level {studentData.level}</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {studentData.xp} XP
                    </Badge>
                  </div>
                  <Progress value={xpProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {studentData.nextLevelXP - studentData.xp} XP until Level {studentData.level + 1}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-center">
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">#{studentData.rank}</div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                </div>
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.questsCompleted}</div>
              <p className="text-sm text-muted-foreground">Quests Completed</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.timeSpent}</div>
              <p className="text-sm text-muted-foreground">Time Spent</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{studentData.joinedDate}</div>
              <p className="text-sm text-muted-foreground">Joined Since</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-accent/50">
            <TabsTrigger value="quests" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Quests Done
            </TabsTrigger>
            <TabsTrigger value="rank" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Rank
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Pages
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Time Spent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Completed Quests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questHistory.map((quest) => (
                    <div key={quest.id} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                      <div>
                        <h4 className="font-medium">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground">Completed {quest.completedAt}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">+{quest.xp} XP</div>
                        <div className="text-sm text-muted-foreground">Score: {quest.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rank" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Leaderboard Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-primary">#{studentData.rank}</div>
                  <p className="text-lg text-muted-foreground">Current Rank</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-accent/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{studentData.xp}</div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{studentData.badges}</div>
                      <p className="text-sm text-muted-foreground">Badges</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Course Materials</h4>
                    <p className="text-sm text-muted-foreground">Access your course content and resources</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Assignment Portal</h4>
                    <p className="text-sm text-muted-foreground">Submit and track your assignments</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Grade Book</h4>
                    <p className="text-sm text-muted-foreground">View your grades and progress</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Study Groups</h4>
                    <p className="text-sm text-muted-foreground">Join collaborative study sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Learning Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{studentData.timeSpent}</div>
                    <p className="text-muted-foreground">Total Time Spent Learning</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-accent/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">12h 15m</div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">2h 30m</div>
                      <p className="text-sm text-muted-foreground">Daily Average</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Business Quiz</span>
                        <span className="text-muted-foreground">25 minutes</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Course Reading</span>
                        <span className="text-muted-foreground">45 minutes</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Discussion Forum</span>
                        <span className="text-muted-foreground">15 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Recent Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentBadges.map((badge) => (
                <div key={badge.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-3xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                    {badge.icon}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                  <Badge variant="secondary" className={`text-xs mb-1 ${
                    badge.type === 'gold' ? 'bg-yellow-100 text-yellow-800' : 
                    badge.type === 'silver' ? 'bg-gray-100 text-gray-800' : 
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {badge.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{badge.earnedAt}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;