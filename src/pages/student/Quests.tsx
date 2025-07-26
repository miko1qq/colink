import { ArrowLeft, Target, Clock, Trophy, CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Quests = () => {
  const quests = [
    {
      id: 1,
      title: "Complete Computer Science Assignment",
      description: "Submit your final project on data structures and algorithms",
      xp: 150,
      difficulty: "Medium",
      category: "Academic",
      status: "in-progress",
      progress: 75,
      timeEstimate: "2 hours",
      dueDate: "2024-01-25"
    },
    {
      id: 2,
      title: "Attend Virtual Lab Session",
      description: "Join the weekly virtual laboratory session for practical learning",
      xp: 100,
      difficulty: "Easy",
      category: "Attendance",
      status: "available",
      progress: 0,
      timeEstimate: "1 hour",
      dueDate: "2024-01-22"
    },
    {
      id: 3,
      title: "Participate in Group Discussion",
      description: "Contribute meaningfully to the forum discussion on modern software development",
      xp: 80,
      difficulty: "Easy",
      category: "Social",
      status: "in-progress",
      progress: 50,
      timeEstimate: "30 mins",
      dueDate: "2024-01-24"
    },
    {
      id: 4,
      title: "Research Paper Review",
      description: "Read and analyze the assigned research paper on machine learning applications",
      xp: 200,
      difficulty: "Hard",
      category: "Research",
      status: "available",
      progress: 0,
      timeEstimate: "3 hours",
      dueDate: "2024-01-28"
    },
    {
      id: 5,
      title: "Team Project Milestone",
      description: "Complete the first milestone of your group project",
      xp: 180,
      difficulty: "Medium",
      category: "Teamwork",
      status: "completed",
      progress: 100,
      timeEstimate: "4 hours",
      dueDate: "2024-01-20"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress": return <PlayCircle className="h-5 w-5 text-primary" />;
      default: return <Target className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
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
              Your Quests 🎯
            </h1>
            <p className="text-muted-foreground">Complete quests to earn XP and unlock badges</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {quests.filter(q => q.status === "available" || q.status === "in-progress").length}
              </div>
              <p className="text-sm text-muted-foreground">Active Quests</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {quests.filter(q => q.status === "completed").length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {quests.reduce((total, quest) => quest.status === "completed" ? total + quest.xp : total, 0)}
              </div>
              <p className="text-sm text-muted-foreground">XP Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          {quests.map((quest) => (
            <Card key={quest.id} className="shadow-card hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(quest.status)}
                    <div>
                      <CardTitle className="text-lg">{quest.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{quest.xp} XP</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar (for in-progress quests) */}
                {quest.status === "in-progress" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>
                )}

                {/* Quest Details */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className={getStatusColor(quest.status)}>
                    {quest.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline">{quest.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {quest.timeEstimate}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(quest.dueDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  {quest.status === "completed" ? (
                    <Button disabled variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  ) : quest.status === "in-progress" ? (
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Continue Quest
                    </Button>
                  ) : (
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Quest
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;