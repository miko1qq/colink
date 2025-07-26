import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Save, 
  Eye, 
  Calendar as CalendarIcon, 
  Trophy, 
  Target, 
  BookOpen,
  ArrowLeft,
  Trash2,
  Edit3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { questService, type Quest } from "@/lib/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BottomNavigation from "@/components/BottomNavigation";

const QuestBuilder = () => {
  const { user, profile } = useUser();
  const { toast } = useToast();

  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    xp: 100,
    published: false,
    deadline: null as Date | null
  });

  // Fetch professor's quests
  useEffect(() => {
    if (!user || !profile || profile.role !== 'professor') return;

    const fetchQuests = async () => {
      try {
        setLoading(true);
        const professorQuests = await questService.getQuestsByCreator(user.id);
        setQuests(professorQuests);
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

    fetchQuests();
  }, [user, profile, toast]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      xp: 100,
      published: false,
      deadline: null
    });
    setEditingQuest(null);
    setShowForm(false);
  };

  const handleEdit = (quest: Quest) => {
    setFormData({
      title: quest.title,
      description: quest.description,
      xp: quest.xp,
      published: quest.published,
      deadline: quest.deadline ? new Date(quest.deadline) : null
    });
    setEditingQuest(quest);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const questData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        xp: formData.xp,
        published: formData.published,
        deadline: formData.deadline?.toISOString() || null,
        created_by: user!.id
      };

      if (editingQuest) {
        // Update existing quest
        const updatedQuest = await questService.updateQuest(editingQuest.id, questData);
        if (updatedQuest) {
          setQuests(prev => prev.map(q => q.id === editingQuest.id ? updatedQuest : q));
          toast({
            title: "Quest Updated",
            description: "Your quest has been updated successfully"
          });
        }
      } else {
        // Create new quest
        const newQuest = await questService.createQuest(questData);
        if (newQuest) {
          setQuests(prev => [newQuest, ...prev]);
          toast({
            title: "Quest Created",
            description: "Your quest has been created successfully"
          });
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving quest:', error);
      toast({
        title: "Error",
        description: "Failed to save quest",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;

    try {
      const success = await questService.deleteQuest(questId);
      if (success) {
        setQuests(prev => prev.filter(q => q.id !== questId));
        toast({
          title: "Quest Deleted",
          description: "Quest has been deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting quest:', error);
      toast({
        title: "Error",
        description: "Failed to delete quest",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (quest: Quest) => {
    try {
      const updatedQuest = await questService.updateQuest(quest.id, {
        published: !quest.published
      });
      
      if (updatedQuest) {
        setQuests(prev => prev.map(q => q.id === quest.id ? updatedQuest : q));
        toast({
          title: quest.published ? "Quest Unpublished" : "Quest Published",
          description: quest.published 
            ? "Quest is no longer visible to students" 
            : "Quest is now visible to students"
        });
      }
    } catch (error) {
      console.error('Error toggling quest publication:', error);
      toast({
        title: "Error",
        description: "Failed to update quest",
        variant: "destructive"
      });
    }
  };

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
          <p className="text-muted-foreground">Loading quests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white pb-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/professor/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Quest Builder ⚔️</h1>
              <p className="text-muted-foreground">Create engaging quests for your students</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Quest
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quest Form */}
          {showForm && (
            <Card className="lg:col-span-1 shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {editingQuest ? "Edit Quest" : "Create New Quest"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quest Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter quest title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students need to do..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px] border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xp">XP Reward</Label>
                  <Input
                    id="xp"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.xp}
                    onChange={(e) => setFormData(prev => ({ ...prev, xp: parseInt(e.target.value) || 100 }))}
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-primary/20",
                          !formData.deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deadline || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, deadline: date || null }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : editingQuest ? "Update Quest" : "Create Quest"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quest List */}
          <Card className={`shadow-lg border-primary/20 ${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Your Quests ({quests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quests.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No quests yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first quest to engage your students
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Quest
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {quests.map((quest) => (
                      <Card key={quest.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{quest.title}</h3>
                                <Badge 
                                  variant={quest.published ? "default" : "secondary"}
                                  className={quest.published ? "bg-green-100 text-green-800" : ""}
                                >
                                  {quest.published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {quest.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Trophy className="h-4 w-4" />
                                  {quest.xp} XP
                                </div>
                                {quest.deadline && (
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    Due {format(new Date(quest.deadline), "MMM d, yyyy")}
                                  </div>
                                )}
                                <div className="text-xs">
                                  Created {format(new Date(quest.created_at), "MMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => togglePublished(quest)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(quest)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(quest.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation userRole="professor" />
    </div>
  );
};

export default QuestBuilder;