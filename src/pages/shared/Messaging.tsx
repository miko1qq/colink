import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare, Send, Search, Filter, User, Clock, CheckCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { messageService, userService, type UserProfile, type Message } from "@/lib/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const Messaging = () => {
  const location = useLocation();
  const { user, profile } = useUser();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<UserProfile[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const isStudent = profile?.role === 'student';
  const oppositeRole = isStudent ? 'professor' : 'student';

  // Fetch conversations and available users
  useEffect(() => {
    if (!user || !profile) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get existing conversations
        const existingConversations = await messageService.getConversations(user.id);
        setConversations(existingConversations);

        // Get all users of opposite role for new conversations
        const oppositeRoleUsers = await userService.getUsersByRole(oppositeRole);
        setAvailableUsers(oppositeRoleUsers);

      } catch (error) {
        console.error('Error fetching messaging data:', error);
        toast({
          title: "Error",
          description: "Failed to load messaging data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile, oppositeRole, toast]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!user || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const userMessages = await messageService.getMessages(user.id, selectedUser.id);
        setMessages(userMessages);
        
        // Mark messages as read
        const unreadMessages = userMessages.filter(msg => 
          msg.receiver_id === user.id && !msg.read
        );
        
        for (const msg of unreadMessages) {
          await messageService.markMessageAsRead(msg.id);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user, selectedUser]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const subscription = messageService.subscribeToMessages(user.id, (newMessage) => {
      // Update messages if it's from the currently selected user
      if (selectedUser && newMessage.sender_id === selectedUser.id) {
        setMessages(prev => [...prev, newMessage]);
        messageService.markMessageAsRead(newMessage.id);
      }
      
      // Update conversations list
      toast({
        title: "New Message",
        description: `New message from ${newMessage.sender?.name || 'Unknown'}`,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedUser, toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !selectedUser || sending) return;

    setSending(true);
    try {
      const newMessage = await messageService.sendMessage(
        user.id,
        selectedUser.id,
        messageText.trim()
      );

      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        setMessageText("");
        
        // Add to conversations if not already there
        if (!conversations.find(conv => conv.id === selectedUser.id)) {
          setConversations(prev => [selectedUser, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allConversationUsers = [
    ...conversations,
    ...filteredUsers.filter(u => !conversations.find(c => c.id === u.id))
  ];

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white p-6">
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
              Messages 💬
            </h1>
            <p className="text-muted-foreground">
              {isStudent ? "Communicate with your professors" : "Send guidance to students"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-9 border-primary/20 focus:border-primary" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {allConversationUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No {oppositeRole}s found</p>
                  </div>
                ) : (
                  allConversationUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedUser?.id === user.id ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm truncate">{user.name || user.email}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user.role}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 shadow-lg border-primary/20 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedUser.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedUser.name || selectedUser.email}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwn = message.sender_id === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div className={`flex items-center gap-1 justify-between mt-1 ${
                                  isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  <p className="text-xs">
                                    {formatMessageTime(message.timestamp)}
                                  </p>
                                  {isOwn && (
                                    <div className="text-xs">
                                      {message.read ? (
                                        <CheckCheck className="h-3 w-3" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
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
                      onKeyDown={handleKeyPress}
                      className="min-h-[60px] resize-none border-primary/20 focus:border-primary"
                      disabled={sending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="self-end bg-primary hover:bg-primary/90"
                      disabled={!messageText.trim() || sending}
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
                  <p>Select a {oppositeRole} to start messaging</p>
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