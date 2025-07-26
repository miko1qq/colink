import { ArrowLeft, MessageSquare, Send, Search, Filter, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Messaging = () => {
  const location = useLocation();
  const isStudent = !location.pathname.includes("professor");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState("");

  const conversations = isStudent ? [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      role: "Professor - Computer Science",
      lastMessage: "Great work on your latest assignment! Keep it up.",
      timestamp: "2 hours ago",
      unread: 0,
      avatar: "SW"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      role: "Professor - Mathematics",
      lastMessage: "The upcoming quiz will cover chapters 5-7. Please review.",
      timestamp: "1 day ago",
      unread: 1,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Professor - Engineering",
      lastMessage: "Your project proposal looks interesting. Let's discuss it further.",
      timestamp: "2 days ago",
      unread: 0,
      avatar: "ER"
    }
  ] : [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Student - Computer Science",
      lastMessage: "Thank you for the feedback on my assignment!",
      timestamp: "1 hour ago",
      unread: 2,
      avatar: "AT"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Student - Computer Science",
      lastMessage: "Could you please clarify the requirements for the group project?",
      timestamp: "3 hours ago",
      unread: 1,
      avatar: "MG"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Student - Computer Science",
      lastMessage: "I'm having trouble with the algorithm implementation.",
      timestamp: "5 hours ago",
      unread: 0,
      avatar: "DC"
    },
    {
      id: 4,
      name: "Sarah Ahmed",
      role: "Student - Computer Science",
      lastMessage: "When is the deadline for the research paper?",
      timestamp: "1 day ago",
      unread: 3,
      avatar: "SA"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: isStudent ? "Dr. Sarah Wilson" : "Alex Thompson",
      content: isStudent 
        ? "Hi Alex! I've reviewed your Computer Science assignment and I'm impressed with your implementation of the data structures."
        : "Hi Dr. Wilson! Thank you for reviewing my assignment. I worked really hard on the data structures implementation.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: isStudent ? "You" : "You",
      content: isStudent
        ? "Thank you so much for the feedback! I spent a lot of time researching different approaches to optimize the algorithm."
        : "I'm glad to see your dedication. Your approach to the binary search tree was particularly well thought out.",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: isStudent ? "Dr. Sarah Wilson" : "Alex Thompson",
      content: isStudent
        ? "Your binary search tree implementation shows great understanding. For the next assignment, try to focus on error handling as well."
        : "Thank you! I'll definitely focus on error handling for the next assignment. Should I also consider edge cases for empty trees?",
      timestamp: "10:40 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: isStudent ? "You" : "You",
      content: isStudent
        ? "That's a great suggestion! I'll make sure to include comprehensive error handling and edge case testing."
        : "Absolutely! Edge cases are crucial for robust code. I'd also recommend adding unit tests to validate your implementations.",
      timestamp: "11:15 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: isStudent ? "Dr. Sarah Wilson" : "Alex Thompson",
      content: isStudent
        ? "Great work on your latest assignment! Keep it up."
        : "Thank you for the feedback on my assignment!",
      timestamp: "2 hours ago",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText("");
    }
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={isStudent ? "/student/dashboard" : "/professor/dashboard"}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {isStudent ? "Messages 💬" : "Motivate Students 💪"}
            </h1>
            <p className="text-muted-foreground">
              {isStudent ? "Communicate with your professors" : "Send motivation and guidance to students"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{conversation.name}</h4>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.role}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {conversation.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 shadow-card flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedConv.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedConv.role}</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="self-end bg-gradient-primary hover:opacity-90"
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messaging;