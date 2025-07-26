import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  type: string;
}

interface BadgeEarnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

const BadgeEarnedModal = ({ isOpen, onClose, badge }: BadgeEarnedModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center border-2 border-primary/20 shadow-badge">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  fontSize: `${Math.random() * 10 + 10}px`,
                }}
              >
                {['🎉', '✨', '🏆', '⭐', '🎊'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        <DialogHeader className="space-y-6">
          <div className="mx-auto">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-accent rounded-full flex items-center justify-center text-5xl animate-float border-4 border-primary/20">
                {badge.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl font-bold text-primary">
                Badge Earned!
              </DialogTitle>
            </div>
            <h3 className="text-xl font-semibold">{badge.name}</h3>
            <p className="text-muted-foreground">{badge.description}</p>
          </div>

          <div className="bg-gradient-secondary rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-primary">+{badge.xpReward} XP</span>
            </div>
            <p className="text-sm text-muted-foreground">Added to your profile</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onClose} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Awesome! Continue Learning
            </Button>
            <p className="text-xs text-muted-foreground">
              Keep completing quests to unlock more badges!
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeEarnedModal;