import { useState, useEffect, useRef } from "react";
import { User, BookOpen, Users, TrendingUp, Award, Upload, Edit2, Save, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";
// Removed unused import
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const ProfessorProfile = () => {
  const { user, profile, uploadAvatar } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Professor data - this would come from Supabase
  const professorData = {
    full_name: "Alidar Koyanbaev",
    email: "alidar.koyanbaev@coventry.edu.kz",
    role: "Professor of Computer Science",
    department: "Computer Science Faculty",
    questsCreated: 15,
    studentsEngaged: 147,
    totalXPImpact: 12450,
    avgStudentScore: 78,
    avatar: "/src/assets/logo.png",
    joinedDate: "September 2024"
  };

  const questsCreated = [
    { id: 1, title: "Introduction to Programming", students: 45, avgScore: 82, xpReward: 150 },
    { id: 2, title: "Data Structures Fundamentals", students: 38, avgScore: 75, xpReward: 200 },
    { id: 3, title: "Algorithm Design", students: 42, avgScore: 79, xpReward: 180 },
    { id: 4, title: "Object-Oriented Programming", students: 51, avgScore: 85, xpReward: 170 },
    { id: 5, title: "Database Management", students: 33, avgScore: 73, xpReward: 160 },
  ];

  const engagementData = [
    { month: 'Jan', engagement: 65, students: 120 },
    { month: 'Feb', engagement: 70, students: 125 },
    { month: 'Mar', engagement: 75, students: 135 },
    { month: 'Apr', engagement: 80, students: 140 },
    { month: 'May', engagement: 85, students: 147 },
    { month: 'Jun', engagement: 78, students: 145 },
  ];

  const xpImpactData = [
    { quest: 'Intro Programming', impact: 6750 },
    { quest: 'Data Structures', impact: 7600 },
    { quest: 'Algorithms', impact: 7560 },
    { quest: 'OOP', impact: 8670 },
    { quest: 'Database', impact: 5280 },
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Professor Profile</h1>
          <p className="text-muted-foreground">Manage your academic profile and track your teaching impact</p>
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
                      src={profile?.avatar_url || professorData.avatar} 
                      alt={profile?.full_name || professorData.full_name} 
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                      {(profile?.full_name || professorData.full_name).split(' ').map(n => n[0]).join('')}
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
                    <h2 className="text-2xl font-bold text-primary">{professorData.full_name}</h2>
                    <p className="text-lg text-muted-foreground">{professorData.role}</p>
                    <p className="text-sm text-muted-foreground">{professorData.department}</p>
                    <p className="text-sm text-muted-foreground">{professorData.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>

                {/* Teaching Impact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-accent/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">{professorData.questsCreated}</div>
                    <p className="text-xs text-muted-foreground">Quests Created</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">{professorData.studentsEngaged}</div>
                    <p className="text-xs text-muted-foreground">Students Engaged</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">{professorData.totalXPImpact}</div>
                    <p className="text-xs text-muted-foreground">Total XP Impact</p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">{professorData.avgStudentScore}%</div>
                    <p className="text-xs text-muted-foreground">Avg Student Score</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.questsCreated}</div>
              <p className="text-sm text-muted-foreground">Quests Created</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.studentsEngaged}</div>
              <p className="text-sm text-muted-foreground">Students Engaged</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.totalXPImpact}</div>
              <p className="text-sm text-muted-foreground">Total XP Impact</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{professorData.avgStudentScore}%</div>
              <p className="text-sm text-muted-foreground">Avg Student Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Student Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#0388fc" 
                      strokeWidth={3}
                      dot={{ fill: '#0388fc', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* XP Impact per Quest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                XP Impact per Quest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={xpImpactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="quest" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="impact" fill="#0388fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quests Created */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Quests Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questsCreated.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-primary">{quest.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {quest.students} students enrolled • Average score: {quest.avgScore}%
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">+{quest.xpReward} XP</div>
                      <div className="text-xs text-muted-foreground">Per completion</div>
                    </div>
                    <div className="w-16">
                      <Progress value={quest.avgScore} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teaching Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Student Satisfaction</span>
                  <span className="font-bold text-primary">4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quest Completion Rate</span>
                  <span className="font-bold text-primary">87%</span>
                </div>
                <Progress value={87} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Student Engagement</span>
                  <span className="font-bold text-primary">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Created "Algorithm Design" quest</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Awarded 15 badges to students</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Updated course materials</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Reviewed student submissions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Department</h4>
                  <p className="text-primary">{professorData.department}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Joined</h4>
                  <p className="text-primary">{professorData.joinedDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Specialization</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Programming</Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Algorithms</Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Data Science</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Awards and Recognition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Awards & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center text-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  🏆
                </div>
                <h4 className="font-medium text-sm mb-1">Best Professor 2024</h4>
                <p className="text-xs text-muted-foreground">Student Choice Award</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center text-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  📚
                </div>
                <h4 className="font-medium text-sm mb-1">Innovation in Teaching</h4>
                <p className="text-xs text-muted-foreground">University Recognition</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  🎯
                </div>
                <h4 className="font-medium text-sm mb-1">High Engagement</h4>
                <p className="text-xs text-muted-foreground">Top 5% Faculty</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-2xl hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  ⭐
                </div>
                <h4 className="font-medium text-sm mb-1">Excellence Badge</h4>
                <p className="text-xs text-muted-foreground">5+ Years Service</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorProfile;