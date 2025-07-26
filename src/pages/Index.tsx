import { GraduationCap, Users, Trophy, Target, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import CoventryLogo from "@/components/CoventryLogo";

const Index = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-white"></div>
      
      {/* Navigation */}
      <div className="absolute top-20 right-6 z-20">
        <Link to="/faq">
          <Button variant="outline" size="sm" className="bg-white shadow-sm border-primary/20 hover:bg-primary hover:text-white">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-8">
            <div className="mb-8">
              <CoventryLogo size="xl" className="mx-auto mb-6" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">
              CoLink
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary/80 mb-6">
              Coventry University Astana
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Engage in academic excellence through interactive quests, earn badges, and compete in friendly leaderboards.
              Choose your role to begin your learning journey.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
            {/* Student Card */}
            <Link to="/login?role=student" className="group">
              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer h-full border-2 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-primary mb-2">I'm a Student</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6 px-8 pb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Complete academic quests, earn valuable XP, unlock achievement badges, and climb the competitive leaderboard
                  </p>
                  <div className="space-y-4 text-base">
                    <div className="flex items-center justify-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Complete Academic Quests</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>Earn Badges & XP Points</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Compete on Leaderboards</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-4 rounded-xl font-semibold" size="lg">
                      Enter as Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Professor Card */}
            <Link to="/login?role=professor" className="group">
              <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer h-full border-2 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-primary mb-2">I'm a Professor</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6 px-8 pb-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Create engaging quests, track student engagement, award achievement badges, and analyze comprehensive progress
                  </p>
                  <div className="space-y-4 text-base">
                    <div className="flex items-center justify-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Create Learning Quests</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>Award Student Badges</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Track Student Analytics</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-4 rounded-xl font-semibold" size="lg">
                      Enter as Professor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-muted-foreground mt-16 pt-8 border-t border-primary/10">
            <p className="text-base">
              Powered by modern web technology • Built for academic excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;