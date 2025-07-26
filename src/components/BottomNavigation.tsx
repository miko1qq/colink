import { Target, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  userRole: 'student' | 'professor';
  xp?: number;
  level?: number;
  coins?: number;
  notificationCount?: number;
}

const BottomNavigation = ({ 
  userRole, 
  xp = 1250, 
  level = 8, 
  coins = 3, 
  notificationCount = 5 
}: BottomNavigationProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getButtonClass = (path: string) => 
    `flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
      isActive(path) 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
    }`;

  const studentNav = [
    { icon: Target, label: 'Quests', path: '/student/quests' },
    { icon: Users, label: 'Leaderboard', path: '/student/leaderboard' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const professorNav = [
    { icon: Target, label: 'Quests', path: '/professor/quest-builder' },
    { icon: Users, label: 'Analytics', path: '/professor/analytics' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const navItems = userRole === 'student' ? studentNav : professorNav;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 backdrop-blur-sm">
      <div className="max-w-md mx-auto px-4 py-2">
        {/* Navigation Items */}
        
        <div className="flex items-center justify-between">
          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={getButtonClass(item.path)}>
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;