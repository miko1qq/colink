import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Clock,
  HelpCircle,
  BookOpen,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, messageService } from '@/lib/database';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  upvotes: number;
  downvotes: number;
  author: string;
  created_at: string;
  is_popular: boolean;
}

const QnA = () => {
  const [user, setUser] = useState<any>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', icon: BookOpen },
    { value: 'general', label: 'General', icon: HelpCircle },
    { value: 'assignments', label: 'Assignments', icon: BookOpen },
    { value: 'technical', label: 'Technical', icon: Users },
    { value: 'grading', label: 'Grading', icon: Users },
    { value: 'platform', label: 'Platform', icon: Users }
  ];

  // Sample FAQ data (in real app, this would come from Supabase)
  const sampleFAQs: FAQ[] = [
    {
      id: '1',
      question: 'How do I submit a quest for review?',
      answer: 'To submit a quest, go to the Quests page, find your quest, and click the "Submit" button. You can add evidence like links, text descriptions, or file uploads to support your submission.',
      category: 'assignments',
      upvotes: 15,
      downvotes: 2,
      author: 'Prof. Johnson',
      created_at: '2024-01-15T10:00:00Z',
      is_popular: true
    },
    {
      id: '2',
      question: 'How is XP calculated?',
      answer: 'XP is awarded based on quest difficulty and completion quality. Easy quests give 50-100 XP, medium quests give 100-200 XP, and hard quests give 200-300 XP. Bonus XP may be awarded for exceptional work.',
      category: 'grading',
      upvotes: 12,
      downvotes: 1,
      author: 'Prof. Smith',
      created_at: '2024-01-14T14:30:00Z',
      is_popular: true
    },
    {
      id: '3',
      question: 'Can I retake a quiz to improve my score?',
      answer: 'Yes! You can retake quizzes as many times as you want. Your highest score will be recorded, and you\'ll earn XP for each attempt based on your performance.',
      category: 'assignments',
      upvotes: 8,
      downvotes: 0,
      author: 'Prof. Davis',
      created_at: '2024-01-13T09:15:00Z',
      is_popular: false
    },
    {
      id: '4',
      question: 'How do badges work?',
      answer: 'Badges are automatically awarded when you reach certain milestones. Bronze badges are earned at 100 XP, Silver at 250 XP, Gold at 500 XP, and Platinum at 1000 XP. Special achievement badges are also available.',
      category: 'general',
      upvotes: 10,
      downvotes: 1,
      author: 'Prof. Wilson',
      created_at: '2024-01-12T16:45:00Z',
      is_popular: true
    },
    {
      id: '5',
      question: 'What should I do if I encounter a technical issue?',
      answer: 'For technical issues, first try refreshing your browser. If the problem persists, contact the support team through the messaging system or email support@coventryastana.edu.kz',
      category: 'technical',
      upvotes: 6,
      downvotes: 0,
      author: 'Tech Support',
      created_at: '2024-01-11T11:20:00Z',
      is_popular: false
    }
  ];

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
    setFaqs(sampleFAQs);
  }, []);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = filteredFAQs.filter(faq => faq.is_popular);
  const regularFAQs = filteredFAQs.filter(faq => !faq.is_popular);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!user) {
      toast.error('Please log in to ask questions');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would save to Supabase
      const newFAQ: FAQ = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer || 'Awaiting answer from professors...',
        category: newCategory,
        upvotes: 0,
        downvotes: 0,
        author: user.name,
        created_at: new Date().toISOString(),
        is_popular: false
      };

      setFaqs(prev => [newFAQ, ...prev]);
      setNewQuestion('');
      setNewAnswer('');
      setNewCategory('general');
      setShowAddDialog(false);
      toast.success('Question submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit question');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (faqId: string, type: 'up' | 'down') => {
    setFaqs(prev => prev.map(faq => {
      if (faq.id === faqId) {
        const newUpvotes = type === 'up' ? faq.upvotes + 1 : faq.upvotes;
        const newDownvotes = type === 'down' ? faq.downvotes + 1 : faq.downvotes;
        return {
          ...faq,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          is_popular: (newUpvotes - newDownvotes) >= 8
        };
      }
      return faq;
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const FAQCard = ({ faq, isPopular = false }: { faq: FAQ; isPopular?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
        isPopular ? 'border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-2">
                {faq.question}
                {isPopular && (
                  <Badge className="ml-2 bg-primary/20 text-primary">
                    Popular
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {faq.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(faq.created_at)}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.value === faq.category)?.label || faq.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {faq.answer}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(faq.id, 'up')}
                className="flex items-center gap-1 hover:text-green-600"
              >
                <ThumbsUp className="h-4 w-4" />
                {faq.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(faq.id, 'down')}
                className="flex items-center gap-1 hover:text-red-600"
              >
                <ThumbsDown className="h-4 w-4" />
                {faq.downvotes}
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Q&A Center</h1>
          <p className="text-muted-foreground text-lg">
            Get answers to your questions and help fellow students
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ask Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ask a New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.filter(c => c.value !== 'all').map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Question</label>
                  <Textarea
                    placeholder="What would you like to know?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    rows={3}
                  />
                </div>
                {user?.role === 'professor' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Answer (Optional)</label>
                    <Textarea
                      placeholder="Provide an answer if you know it..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuestion} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Question'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Popular Questions */}
        {popularFAQs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <ThumbsUp className="h-6 w-6" />
              Popular Questions
            </h2>
            <div className="grid gap-4">
              {popularFAQs.map((faq) => (
                <FAQCard key={faq.id} faq={faq} isPopular />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            All Questions
            <Badge variant="secondary">{regularFAQs.length}</Badge>
          </h2>
          
          {regularFAQs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or category filter'
                    : 'Be the first to ask a question!'
                  }
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  Ask the First Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {regularFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FAQCard faq={faq} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>
            Can't find what you're looking for? Ask a new question and help build our knowledge base!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QnA;