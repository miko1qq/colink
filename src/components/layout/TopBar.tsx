import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopRightNavigation from "../TopRightNavigation";
import CoventryLogo from "../CoventryLogo"; 

const TopBar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
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
          {/* Official Site Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://coventry.edu.kz/ru', '_blank')}
            className="text-muted-foreground hover:text-primary text-xs hidden sm:flex"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Official Site
          </Button>

          {/* User Navigation (includes single search) */}
          <TopRightNavigation />
        </div>
      </div>
    </header>
  );
};

export default TopBar;