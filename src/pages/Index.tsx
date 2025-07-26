import { GraduationCap, Users, Trophy, Target, HelpCircle, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CoventryLogo from "@/components/CoventryLogo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 right-6 z-20"
      >
        <Link to="/faq">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary hover:text-white transition-all duration-300">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Two-column layout on larger screens, stacked on mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Logo and Title */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center xl:text-left space-y-8"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center xl:justify-start"
                >
                  <CoventryLogo size="xl" className="drop-shadow-lg" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-primary mb-4 leading-tight">
                    CoLink
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold text-primary/80 mb-6">
                    Coventry University Astana
                  </h2>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto xl:mx-0 leading-relaxed"
                >
                  Transform your academic journey with interactive quests, achievement badges, and competitive leaderboards. 
                  Experience education reimagined for the digital age.
                </motion.p>
              </div>

              {/* Features list - only visible on larger screens */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="hidden lg:block space-y-4"
              >
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base">Interactive Learning Quests</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base">Achievement Badge System</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-base">Real-time Analytics & Leaderboards</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Role Selection Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
                Choose Your Role
              </h3>
              
              <div className="space-y-4">
                {/* Student Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/login?role=student" className="block group">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Trophy className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-primary mb-2">Student Portal</h4>
                            <p className="text-muted-foreground mb-4">
                              Complete quests, earn badges, and climb leaderboards
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Quests</span>
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Badges</span>
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Leaderboard</span>
                            </div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold">
                            Enter →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>

                {/* Professor Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/login?role=professor" className="block group">
                    <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold text-primary mb-2">Professor Portal</h4>
                            <p className="text-muted-foreground mb-4">
                              Create quests, track progress, and analyze engagement
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Quest Builder</span>
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Analytics</span>
                              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Management</span>
                            </div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold">
                            Enter →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </div>
              
              {/* Quick demo access */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-center pt-6"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Want to try it out? Use our demo accounts
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Link to="/login?role=student" className="flex-1">
                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                      Demo Student
                    </Button>
                  </Link>
                  <Link to="/login?role=professor" className="flex-1">
                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                      Demo Professor
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center text-muted-foreground mt-16 pt-8 border-t border-primary/10"
          >
            <p className="text-sm">
              Powered by modern web technology • Built for academic excellence
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;