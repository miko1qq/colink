import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Target, 
  Trophy, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle, 
  Star,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/useUser";
import { questService, questProgressService, badgeService, type Quest, type QuestProgress } from "@/lib/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { format, isAfter } from "date-fns";
import BottomNavigation from "@/components/BottomNavigation";

const Quests = () => {
  const { user, profile } = useUser();
  const { toast } = useToast();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch quests and progress
  useEffect(() => {
    if (!user || !profile || profile.role !== 'student') return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch published quests
        const publishedQuests = await questService.getAllPublishedQuests();
        setQuests(publishedQuests);

        // Fetch student progress
        const studentProgress = await questProgressService.getStudentProgress(user.id);
        setQuestProgress(studentProgress);

      } catch (error) {
        console.error('Error fetching quests:', error);
        toast({
          title: "Error",
          description: "Failed to load quests",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile, toast]);

  const getQuestProgress = (questId: string): QuestProgress | undefined => {
    return questProgress.find(p => p.quest_id === questId);
  };

  const getQuestStatus = (quest: Quest): 'not_started' | 'in_progress' | 'completed' | 'overdue' => {
    const progress = getQuestProgress(quest.id);
    
    if (progress) {
      if (progress.status === 'completed') return 'completed';
      if (progress.status === 'in progress') {
        // Check if overdue
        if (quest.deadline && isAfter(new Date(), new Date(quest.deadline))) {
          return 'overdue';
        }
        return 'in_progress';
      }
    }
    
    // Check if overdue without being started
    if (quest.deadline && isAfter(new Date(), new Date(quest.deadline))) {
      return 'overdue';
    }
    
    return 'not_started';
  };

  const handleStartQuest = async (quest: Quest) => {
    if (!user) return;

    try {
      const progress = await questProgressService.startQuest(quest.id, user.id);
      if (progress) {
        setQuestProgress(prev => {
          const existing = prev.find(p => p.quest_id === quest.id);
          if (existing) {
            return prev.map(p => p.quest_id === quest.id ? progress : p);
          } else {
            return [...prev, progress];
          }
        });
        
        toast({
          title: "Quest Started!",
          description: `You've started "${quest.title}". Good luck!`
        });
      }
    } catch (error) {
      console.error('Error starting quest:', error);
      toast({
        title: "Error",
        description: "Failed to start quest",
        variant: "destructive"
      });
    }
  };

  const handleCompleteQuest = async (quest: Quest) => {
    if (!user) return;

    try {
      // For demo purposes, we'll complete with a random score
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      
      const progress = await questProgressService.completeQuest(quest.id, user.id, score);
      if (progress) {
        setQuestProgress(prev => {
          const existing = prev.find(p => p.quest_id === quest.id);
          if (existing) {
            return prev.map(p => p.quest_id === quest.id ? progress : p);
          } else {
            return [...prev, progress];
          }
        });

        // Award badge for first completion
        const completedCount = questProgress.filter(p => p.status === 'completed').length;
        if (completedCount === 0) {
          // Award "First Steps" badge
          const badges = await badgeService.getAllBadges();
          const firstStepsBadge = badges.find(b => b.name === 'First Steps');
          if (firstStepsBadge) {
            await badgeService.awardBadge(firstStepsBadge.id, user.id);
          }
        }
        
        toast({
          title: "Quest Completed! 🎉",
          description: `You earned ${quest.xp} XP and scored ${score}%!`
        });
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      toast({
        title: "Error",
        description: "Failed to complete quest",
        variant: "destructive"
      });
    }
  };

  // Filter and sort quests
  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const status = getQuestStatus(quest);
    
    switch (filterStatus) {
      case 'available':
        return status === 'not_started';
      case 'in_progress':
        return status === 'in_progress';
      case 'completed':
        return status === 'completed';
      case 'overdue':
        return status === 'overdue';
      default:
        return true;
    }
  });

  const sortedQuests = [...filteredQuests].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'xp_high':
        return b.xp - a.xp;
      case 'xp_low':
        return a.xp - b.xp;
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Available';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  if (!profile || profile.role !== 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Access denied. This page is only available to students.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quests...</p>
        </div>
      </div>
    );
  }

  const completedQuests = questProgress.filter(p => p.status === 'completed');
  const totalXP = completedQuests.reduce((sum, p) => {
    const quest = quests.find(q => q.id === p.quest_id);
    return sum + (quest?.xp || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Quests ⚔️</h1>
              <p className="text-muted-foreground">Complete quests to earn XP and badges</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedQuests.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalXP}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-primary/20 focus:border-primary"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 border-primary/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quests</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 border-primary/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="xp_high">Highest XP</SelectItem>
                  <SelectItem value="xp_low">Lowest XP</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quest List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedQuests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No quests found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Check back later for new quests from your professors'}
              </p>
            </div>
          ) : (
            sortedQuests.map((quest) => {
              const status = getQuestStatus(quest);
              const progress = getQuestProgress(quest.id);
              
              return (
                <Card key={quest.id} className="shadow-lg border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{quest.title}</CardTitle>
                      <Badge className={getStatusColor(status)}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {quest.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-primary">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">{quest.xp} XP</span>
                      </div>
                      
                      {quest.deadline && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">
                            Due {format(new Date(quest.deadline), "MMM d")}
                          </span>
                        </div>
                      )}
                    </div>

                    {progress?.score && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Your Score</span>
                          <span className="font-medium">{progress.score}%</span>
                        </div>
                        <Progress value={progress.score} className="h-2" />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {status === 'not_started' && (
                        <Button 
                          onClick={() => handleStartQuest(quest)}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Quest
                        </Button>
                      )}
                      
                      {status === 'in_progress' && (
                        <Button 
                          onClick={() => handleCompleteQuest(quest)}
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Quest
                        </Button>
                      )}
                      
                      {status === 'completed' && (
                        <Button 
                          variant="outline"
                          className="w-full border-green-500 text-green-500"
                          disabled
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      )}
                      
                      {status === 'overdue' && (
                        <Button 
                          variant="outline"
                          className="w-full border-red-500 text-red-500"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Overdue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation userRole="student" />
    </div>
  );
};

export default Quests;