import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Sparkles } from "lucide-react";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
}

const BadgeModal = ({ isOpen, onClose, badgeName, badgeDescription, badgeIcon }: BadgeModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-[#003A70] to-[#002A50] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-4xl">{badgeIcon}</span>
          </div>
          <CardTitle className="text-2xl text-[#003A70]">
            Badge Earned! 🎉
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#003A70]">{badgeName}</h3>
            <p className="text-muted-foreground">{badgeDescription}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <Star className="h-5 w-5" />
            <span className="font-medium">Congratulations!</span>
            <Star className="h-5 w-5" />
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={onClose}
              className="w-full bg-[#003A70] hover:bg-[#002A50] text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeModal;