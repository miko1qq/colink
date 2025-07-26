import logo from "@/assets/logo.png";
import { Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopRightNavigation from "../TopRightNavigation";
import { useTheme } from "next-themes"; 

const TopBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Логотип слева */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-lg text-zinc-800 dark:text-white">CovUni Spark</span>
        </div>

        {/* Кнопки справа */}
        <div className="flex items-center gap-3">
          {/* Поиск */}
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>

          {/* Темная / светлая тема */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Уведомления */}
          <TopRightNavigation />
        </div>
      </div>
    </header>
  );
};

export default TopBar;