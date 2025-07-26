import { ArrowLeft, HelpCircle, MessageCircle, Trophy, Target, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link, useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      id: "quest-completion",
      question: "How do I complete a quest?",
      answer: "To complete a quest, click on 'Start Quest' from the quests page. Follow the instructions provided, complete all required tasks, and submit your work. For quiz quests, answer all questions and achieve the minimum passing score. Your progress will be automatically tracked and saved."
    },
    {
      id: "badge-earning",
      question: "How are badges earned?",
      answer: "Badges are earned by completing specific achievements such as finishing quests with high scores, participating in activities, or reaching milestones. Each badge has specific requirements - for example, the Business & Management badge requires completing the quiz with 70% or higher. Check the badge requirements in your profile to see what you need to unlock each one."
    },
    {
      id: "contact-professor",
      question: "How do I contact my professor?",
      answer: "You can contact your professor through the messaging system. Go to the messaging page from your dashboard or use the chat icon in the navigation. You can also participate in course discussions and forums where professors are active."
    },
    {
      id: "xp-system",
      question: "How does the XP system work?",
      answer: "Experience Points (XP) are earned by completing quests, participating in activities, and achieving milestones. Different activities award different amounts of XP based on their difficulty and importance. XP helps you level up and climb the leaderboard, showing your progress and engagement."
    },
    {
      id: "leaderboard",
      question: "How is the leaderboard calculated?",
      answer: "The leaderboard ranks students based on their total XP earned, quest completion rate, and overall engagement. It's updated in real-time as you complete activities. The leaderboard encourages friendly competition and helps you see how you're progressing compared to your peers."
    },
    {
      id: "quest-types",
      question: "What types of quests are available?",
      answer: "There are several types of quests including: Academic assignments, Quiz challenges, Group activities, Research projects, Lab sessions, Discussion participation, and Presentation tasks. Each quest type has different requirements and rewards different amounts of XP."
    },
    {
      id: "technical-issues",
      question: "What should I do if I encounter technical issues?",
      answer: "If you experience technical issues, try refreshing the page first. If the problem persists, contact your professor or the technical support team through the messaging system. Include details about what you were doing when the issue occurred and any error messages you saw."
    },
    {
      id: "profile-customization",
      question: "Can I customize my profile?",
      answer: "Yes! You can update your avatar, view your earned badges, track your XP progress, and see your quest completion history in your profile. Your profile showcases your achievements and progress to professors and peers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Find answers to common questions about CoLink
            </p>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quest Help</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to complete quests and earn XP
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Badge System</h3>
              <p className="text-sm text-muted-foreground">
                Understand how to unlock achievements
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-card transition-all duration-300">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Communication</h3>
              <p className="text-sm text-muted-foreground">
                Connect with professors and peers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you can't find the answer to your question here, don't hesitate to reach out for help.
            </p>
            <div className="flex gap-4">
              <Link to="/messaging">
                <Button className="bg-primary hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;