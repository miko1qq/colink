import { Moon, Sun, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopRightNavigation from "../TopRightNavigation";
import { useTheme } from "@/components/theme-provider"; 

const TopBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-primary">CoLink</span>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Coventry University Astana
          </span>
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