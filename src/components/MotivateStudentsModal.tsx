import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Heart, Star, Trophy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  xp: number;
  level: number;
  lastActive: string;
}

interface MotivateStudentsModalProps {
  children: React.ReactNode;
}

const MotivateStudentsModal = ({ children }: MotivateStudentsModalProps) => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const students: Student[] = [
    { id: "1", name: "Emilia Smailova", xp: 1750, level: 8, lastActive: "2 hours ago" },
    { id: "2", name: "Aruzhan Tolegenova", xp: 2850, level: 14, lastActive: "30 minutes ago" },
    { id: "3", name: "Yerassyl Zhaksylykov", xp: 2750, level: 13, lastActive: "1 hour ago" },
    { id: "4", name: "Aigerim Nurkhanova", xp: 2680, level: 13, lastActive: "45 minutes ago" },
    { id: "5", name: "Nursultan Bekturov", xp: 2420, level: 12, lastActive: "3 hours ago" },
  ];

  const predefinedMessages = [
    {
      id: "1",
      title: "Great Progress!",
      message: "You're doing amazing work! Keep up the excellent progress in your studies. 🌟",
      icon: <Star className="w-4 h-4" />
    },
    {
      id: "2", 
      title: "Motivation Boost",
      message: "Remember, every expert was once a beginner. You're on the right path to success! 💪",
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: "3",
      title: "Keep Going!",
      message: "Don't give up! Your hard work and dedication will pay off. I believe in you! 🚀",
      icon: <Heart className="w-4 h-4" />
    },
    {
      id: "4",
      title: "Outstanding Effort",
      message: "Your commitment to learning is truly inspiring. Continue this excellent momentum! ⭐",
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: "5",
      title: "You've Got This!",
      message: "Challenges are what make life interesting. Overcoming them is what makes it meaningful. Keep pushing forward! 🎯",
      icon: <MessageSquare className="w-4 h-4" />
    }
  ];

  const handleSendMessage = async () => {
    if (!selectedStudent) {
      toast({
        title: "Select a Student",
        description: "Please select a student to send the message to.",
        variant: "destructive",
      });
      return;
    }

    const messageToSend = customMessage || predefinedMessages.find(m => m.id === selectedMessage)?.message;
    
    if (!messageToSend) {
      toast({
        title: "Select a Message",
        description: "Please select a predefined message or write a custom one.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would integrate with your notification system/Supabase
      const student = students.find(s => s.id === selectedStudent);
      
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent Successfully! 📤",
        description: `Motivational message sent to ${student?.name}`,
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">Delivered</span>
          </div>
        ),
      });

      // Reset form and close modal
      setSelectedStudent("");
      setSelectedMessage("");
      setCustomMessage("");
      setIsOpen(false);
      
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <MessageSquare className="w-5 h-5" />
            Motivate Students
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Choose a student to motivate" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{student.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary" className="text-xs">
                          Level {student.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {student.lastActive}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Predefined Messages */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quick Messages</label>
            <div className="grid grid-cols-1 gap-2">
              {predefinedMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message.id);
                    setCustomMessage("");
                  }}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedMessage === message.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.icon}
                    <span className="font-medium text-sm">{message.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{message.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Or write a custom message</label>
            <Textarea
              placeholder="Write your own motivational message..."
              value={customMessage}
              onChange={(e) => {
                setCustomMessage(e.target.value);
                setSelectedMessage("");
              }}
              className="min-h-[80px] border-primary/20 focus:border-primary"
            />
          </div>

          {/* Send Button */}
          <Button 
            onClick={handleSendMessage}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!selectedStudent || (!selectedMessage && !customMessage)}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Motivational Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MotivateStudentsModal;