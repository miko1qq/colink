import { useState, useEffect } from "react";
import { ArrowLeft, Target, Clock, Trophy, CheckCircle, PlayCircle, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { questService } from "@/lib/supabaseService";

const Quests = () => {
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const featuredQuest = {
    id: 0,
    title: "Business & Management Quiz",
    description: "Test your knowledge with 4 multiple-choice questions and earn your first badge!",
    xp: 150,
    difficulty: "Medium",
    category: "Quiz",
    status: "available",
    progress: 0,
    timeEstimate: "10 mins",
    dueDate: "No deadline",
    isFeatured: true,
    badge: "🎯"
  };

  useEffect(() => {
    const loadQuests = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Load active quests
        const { data: questsData, error } = await supabase
          .from('quests')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading quests:', error);
        } else {
          setQuests(questsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, []);

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quests...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-primary">
              Your Quests 🎯
            </h1>
            <p className="text-muted-foreground">Complete quests to earn XP and unlock badges</p>
          </div>
        </div>

        {/* Featured Quest */}
        <Card className="shadow-primary border-2 border-primary/30 bg-gradient-accent/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl text-primary">Featured Quest</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">NEW</Badge>
                  </div>
                  <CardTitle className="text-lg">{featuredQuest.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{featuredQuest.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{featuredQuest.xp} XP</div>
                <div className="text-lg">{featuredQuest.badge}</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className={getDifficultyColor(featuredQuest.difficulty)}>
                {featuredQuest.difficulty}
              </Badge>
              <Badge variant="outline">{featuredQuest.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {featuredQuest.timeEstimate}
              </div>
              <div className="text-sm text-muted-foreground">
                {featuredQuest.dueDate}
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/student/business-quiz">
                <Button className="bg-primary hover:bg-primary/90" size="lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {quests.length + 1}
              </div>
              <p className="text-sm text-muted-foreground">Available Quests</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                0
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {quests.reduce((total, quest) => total + (quest.xp_reward || 0), 0) + 150}
              </div>
              <p className="text-sm text-muted-foreground">Total XP Available</p>
            </CardContent>
          </Card>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">All Quests</h2>
          {quests.map((quest) => (
            <Card key={quest.id} className="shadow-card hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{quest.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{quest.xp_reward} XP</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Quest Details */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge className="bg-blue-100 text-blue-800">
                    Available
                  </Badge>
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty?.charAt(0).toUpperCase() + quest.difficulty?.slice(1)}
                  </Badge>
                  <Badge variant="outline">{quest.category}</Badge>
                  {quest.time_estimate && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {quest.time_estimate}
                    </div>
                  )}
                  {quest.due_date && (
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(quest.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  {quest.title === "Business & Management Quiz" ? (
                    <Link to="/student/business-quiz">
                      <Button className="bg-primary hover:bg-primary/90">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </Link>
                  ) : (
                    <Button className="bg-primary hover:bg-primary/90">
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