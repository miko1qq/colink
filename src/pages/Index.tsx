import { GraduationCap, Users, Trophy, Target, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary relative">
      {/* Navigation */}
      <div className="absolute top-4 right-4 z-20">
        <Link to="/faq">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              CoLink
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
              Coventry University Astana
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Engage in academic excellence through quests, badges, and friendly competition.
              Choose your role to begin your journey.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
            {/* Student Card */}
            <Link to="/login?role=student">
              <Card className="bg-white shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer h-full border-2 border-transparent hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-primary">I'm a Student</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Complete quests, earn XP, unlock badges, and climb the leaderboard
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Complete Academic Quests</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>Earn Badges & XP</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Compete on Leaderboards</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                      Enter as Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Professor Card */}
            <Link to="/login?role=professor">
              <Card className="bg-white shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer h-full border-2 border-transparent hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-primary">I'm a Professor</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Create quests, track engagement, award badges, and analyze student progress
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Create Learning Quests</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>Award Student Badges</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Track Student Analytics</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg">
                      Enter as Professor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-muted-foreground mt-12">
            <p className="text-sm">
              Powered by modern web technology • Built for academic excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;