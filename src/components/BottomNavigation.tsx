import { Target, Users, User, BarChart3, MessageSquare, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  userRole: 'student' | 'professor';
  notificationCount?: number;
}

const BottomNavigation = ({ 
  userRole, 
  notificationCount = 0 
}: BottomNavigationProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getButtonClass = (path: string) => 
    `flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 relative ${
      isActive(path) 
        ? 'bg-primary text-primary-foreground shadow-md' 
        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
    }`;

  const studentNav = [
    { icon: Target, label: 'Quests', path: '/student/quests' },
    { icon: Users, label: 'Leaderboard', path: '/student/leaderboard' },
    { icon: MessageSquare, label: 'Messages', path: '/messaging' },
    { icon: User, label: 'Profile', path: '/student/profile' }
  ];

  const professorNav = [
    { icon: Plus, label: 'Create', path: '/professor/quest-builder' },
    { icon: BarChart3, label: 'Analytics', path: '/professor/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messaging' },
    { icon: User, label: 'Profile', path: '/professor/profile' }
  ];

  const navItems = userRole === 'student' ? studentNav : professorNav;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border/50 shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={getButtonClass(item.path)}>
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.label === 'Messages' && notificationCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;