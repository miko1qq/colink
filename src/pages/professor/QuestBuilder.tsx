import { ArrowLeft, Plus, Target, Save, Users, Clock, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";

const QuestBuilder = () => {
  const [questData, setQuestData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    xpReward: 100,
    timeEstimate: "",
    dueDate: "",
    instructions: "",
    isActive: true,
    assignedStudents: "all",
    tags: [] as string[]
  });

  const [currentTag, setCurrentTag] = useState("");

  const categories = [
    "Academic Assignment",
    "Research Project", 
    "Group Activity",
    "Lab Session",
    "Discussion Forum",
    "Presentation",
    "Reading Task",
    "Problem Solving"
  ];

  const difficulties = [
    { value: "easy", label: "Easy", xp: 50 },
    { value: "medium", label: "Medium", xp: 100 },
    { value: "hard", label: "Hard", xp: 200 }
  ];

  const timeEstimates = [
    "30 minutes",
    "1 hour",
    "2 hours", 
    "3 hours",
    "4+ hours",
    "Multiple days"
  ];

  const studentGroups = [
    { value: "all", label: "All Students" },
    { value: "cs101", label: "CS 101 - Introduction to Programming" },
    { value: "cs201", label: "CS 201 - Data Structures" },
    { value: "cs301", label: "CS 301 - Algorithms" },
    { value: "math101", label: "MATH 101 - Calculus I" }
  ];

  const addTag = () => {
    if (currentTag.trim() && !questData.tags.includes(currentTag.trim())) {
      setQuestData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setQuestData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveQuest = () => {
    // Save quest logic here
    console.log("Saving quest:", questData);
  };

  const handleDifficultyChange = (difficulty: string) => {
    const difficultyData = difficulties.find(d => d.value === difficulty);
    setQuestData(prev => ({
      ...prev,
      difficulty,
      xpReward: difficultyData?.xp || 100
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/professor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Quest Builder 🎯
            </h1>
            <p className="text-muted-foreground">Create engaging learning experiences for your students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Quest Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Quest Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter quest title..."
                    value={questData.title}
                    onChange={(e) => setQuestData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief overview of what students will accomplish..."
                    value={questData.description}
                    onChange={(e) => setQuestData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={questData.category}
                      onValueChange={(value) => setQuestData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={questData.difficulty}
                      onValueChange={handleDifficultyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff.value} value={diff.value}>
                            {diff.label} ({diff.xp} XP)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeEstimate">Time Estimate</Label>
                    <Select
                      value={questData.timeEstimate}
                      onValueChange={(value) => setQuestData(prev => ({ ...prev, timeEstimate: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time estimate" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeEstimates.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={questData.dueDate}
                      onChange={(e) => setQuestData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Instructions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Instructions & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="instructions">Detailed Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide step-by-step instructions, requirements, and any resources students will need..."
                    value={questData.instructions}
                    onChange={(e) => setQuestData(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {questData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {questData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Quest Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    min="10"
                    max="500"
                    value={questData.xpReward}
                    onChange={(e) => setQuestData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 100 }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={questData.isActive}
                    onCheckedChange={(checked) => setQuestData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Activate quest immediately</Label>
                </div>
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="assignedStudents">Assign to</Label>
                  <Select
                    value={questData.assignedStudents}
                    onValueChange={(value) => setQuestData(prev => ({ ...prev, assignedStudents: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {studentGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quest Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{questData.xpReward} XP</div>
                  <p className="text-sm text-muted-foreground">Reward</p>
                </div>
                
                {questData.difficulty && (
                  <Badge className="w-full justify-center">
                    {questData.difficulty.toUpperCase()}
                  </Badge>
                )}
                
                {questData.timeEstimate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {questData.timeEstimate}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleSaveQuest}
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={!questData.title || !questData.description}
              >
                <Save className="h-4 w-4 mr-2" />
                {questData.isActive ? "Create & Activate Quest" : "Save as Draft"}
              </Button>
              
              <Button variant="outline" className="w-full">
                Preview Quest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestBuilder;