import { ArrowLeft, HelpCircle, BookOpen, Trophy, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqData = [
    {
      category: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          question: "How do I complete a quest?",
          answer: "To complete a quest, click on the 'Start Quest' button. For quiz quests, you'll need to answer all questions correctly. For other quests, follow the instructions provided by your professor. Once completed, you'll earn XP and potentially unlock badges."
        },
        {
          question: "What are badges and how do I earn them?",
          answer: "Badges are achievements you earn by completing quests and demonstrating excellence. You can earn badges by scoring well on quizzes, completing assignments on time, participating in discussions, and showing consistent engagement. Each badge represents a specific skill or accomplishment."
        },
        {
          question: "How do I track my progress?",
          answer: "Your progress is automatically tracked in your dashboard. You can see your current XP, level, completed quests, and earned badges. The leaderboard shows how you rank compared to other students in your course."
        }
      ]
    },
    {
      category: "Student Features",
      icon: <Trophy className="h-5 w-5" />,
      questions: [
        {
          question: "How does the XP system work?",
          answer: "XP (Experience Points) are earned by completing quests, participating in activities, and achieving high scores. Different quests award different amounts of XP based on difficulty and time investment. As you earn XP, you'll level up and unlock new features."
        },
        {
          question: "Can I retake quizzes if I don't do well?",
          answer: "Quiz retake policies are set by your professor. Some quizzes allow multiple attempts, while others are one-time only. Check the quest details to see if retakes are allowed. Your best score is typically recorded."
        },
        {
          question: "How do I view my earned badges?",
          answer: "You can view all your earned badges in the 'Badges' section of your dashboard. Each badge shows when it was earned and what you accomplished to receive it. Badges are also displayed on your profile for other students to see."
        }
      ]
    },
    {
      category: "Communication",
      icon: <MessageSquare className="h-5 w-5" />,
      questions: [
        {
          question: "How do I contact my professor?",
          answer: "You can contact your professor through the messaging system in the platform. Go to the 'Messaging' section and select your professor from the contact list. Professors typically respond within 24 hours during weekdays."
        },
        {
          question: "Can I collaborate with other students?",
          answer: "Yes! Many quests encourage collaboration. You can work with other students on group assignments, participate in discussion forums, and even form study groups. Check the quest details to see if collaboration is encouraged or required."
        },
        {
          question: "How do I report technical issues?",
          answer: "If you encounter technical issues, you can report them through the 'Help' section or contact the platform support team. Include details about what you were trying to do and any error messages you received."
        }
      ]
    },
    {
      category: "Platform Features",
      icon: <Users className="h-5 w-5" />,
      questions: [
        {
          question: "What happens if I miss a quest deadline?",
          answer: "Late submissions are handled according to your professor's policies. Some quests may still award partial XP for late completion, while others may not be available after the deadline. Check with your professor for specific policies."
        },
        {
          question: "How do I customize my profile?",
          answer: "You can customize your profile by going to the 'Profile' section. You can upload an avatar, update your personal information, and view your achievement history. Your profile is visible to other students in your course."
        },
        {
          question: "Is my progress saved automatically?",
          answer: "Yes, all your progress is automatically saved to the cloud. You can access your account from any device and your progress will be synchronized. This includes quest completions, XP, badges, and profile information."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/student/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#003A70]">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">Find answers to common questions about CoLink</p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#003A70]">
                  {category.icon}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, questionIndex) => (
                    <AccordionItem 
                      key={questionIndex} 
                      value={`item-${categoryIndex}-${questionIndex}`}
                      className="border border-border/50 rounded-lg"
                    >
                      <AccordionTrigger className="px-4 py-3 text-left hover:bg-accent/50 rounded-t-lg">
                        <span className="font-medium text-[#003A70]">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="shadow-card border-[#003A70]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003A70]">
              <HelpCircle className="h-5 w-5" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex gap-3">
              <Button className="bg-[#003A70] hover:bg-[#002A50] text-white">
                Contact Support
              </Button>
              <Button variant="outline">
                View Tutorial Videos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;