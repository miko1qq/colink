import { Moon, Sun, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopRightNavigation from "../TopRightNavigation";
import { useTheme } from "@/components/theme-provider";
import CoventryLogo from "../CoventryLogo"; 

const TopBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <CoventryLogo size="sm" />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">CoLink</span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Coventry University Astana
            </span>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Navigation */}
          <TopRightNavigation />
        </div>
      </div>
    </header>
  );
};

export default TopBar;