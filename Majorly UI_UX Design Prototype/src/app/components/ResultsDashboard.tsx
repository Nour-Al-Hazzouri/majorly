import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  DollarSign,
  Users,
  CheckCircle2,
  Heart,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { AssessmentData } from "./Assessment";

interface Major {
  id: string;
  title: string;
  category: string;
  matchPercentage: number;
  description: string;
  matchReasons: string[];
  medianSalary: string;
  jobGrowth: string;
  topCareers: string[];
  keySkills: string[];
}

interface ResultsDashboardProps {
  assessmentData: AssessmentData;
  onSelectMajor: (majorId: string) => void;
  onSaveFavorite: (majorId: string) => void;
  savedMajors: string[];
}

// Mock data generation based on assessment
const generateMajors = (data: AssessmentData): Major[] => {
  const majors: Major[] = [
    {
      id: "computer-science",
      title: "Computer Science",
      category: "STEM",
      matchPercentage: 94,
      description: "Study algorithms, software development, and computational theory. Perfect for building the future of technology.",
      matchReasons: [
        "Strong alignment with Problem Solving skills",
        "High interest in Building Technology",
        "Technical skills rated highly",
        "Programming in current skill set"
      ],
      medianSalary: "$95,000",
      jobGrowth: "+22%",
      topCareers: ["Software Engineer", "Data Scientist", "AI Researcher"],
      keySkills: ["Programming", "Algorithms", "Data Structures", "Problem Solving"]
    },
    {
      id: "data-science",
      title: "Data Science",
      category: "STEM",
      matchPercentage: 87,
      description: "Combine statistics, programming, and domain expertise to extract insights from data.",
      matchReasons: [
        "Matches your interest in Working with Data",
        "Analytical thinking strength detected",
        "Data Analysis in aspirations",
        "Strong mathematical background"
      ],
      medianSalary: "$92,000",
      jobGrowth: "+28%",
      topCareers: ["Data Analyst", "ML Engineer", "Business Intelligence Analyst"],
      keySkills: ["Statistics", "Python", "Machine Learning", "Data Visualization"]
    },
    {
      id: "business-analytics",
      title: "Business Analytics",
      category: "Business",
      matchPercentage: 82,
      description: "Use data and analytics to drive business decisions and strategy.",
      matchReasons: [
        "Leadership skills detected",
        "Interest in business and data combined",
        "Communication in your skill set",
        "Strategic thinking capability"
      ],
      medianSalary: "$78,000",
      jobGrowth: "+14%",
      topCareers: ["Business Analyst", "Consultant", "Operations Manager"],
      keySkills: ["Data Analysis", "Business Strategy", "Communication", "Excel"]
    },
    {
      id: "ux-design",
      title: "UX/UI Design",
      category: "Design & Technology",
      matchPercentage: 79,
      description: "Create intuitive and beautiful digital experiences that delight users.",
      matchReasons: [
        "Creative expression strength",
        "Interest in technology and design",
        "Problem-solving capability",
        "User-focused thinking"
      ],
      medianSalary: "$85,000",
      jobGrowth: "+18%",
      topCareers: ["UX Designer", "Product Designer", "Design Lead"],
      keySkills: ["Design Thinking", "Prototyping", "User Research", "Figma"]
    },
    {
      id: "psychology",
      title: "Psychology",
      category: "Social Sciences",
      matchPercentage: 76,
      description: "Study human behavior, cognition, and mental processes to help individuals and society.",
      matchReasons: [
        "Strong interest in helping people",
        "Research skills in your profile",
        "Empathy and communication strengths",
        "Analytical thinking capability"
      ],
      medianSalary: "$72,000",
      jobGrowth: "+8%",
      topCareers: ["Clinical Psychologist", "Counselor", "Research Scientist"],
      keySkills: ["Research Methods", "Statistics", "Counseling", "Critical Thinking"]
    },
    {
      id: "marketing",
      title: "Marketing",
      category: "Business",
      matchPercentage: 73,
      description: "Develop strategies to promote products, services, and brands to target audiences.",
      matchReasons: [
        "Communication skills detected",
        "Creative and analytical balance",
        "Interest in working with people",
        "Strategic thinking capability"
      ],
      medianSalary: "$68,000",
      jobGrowth: "+10%",
      topCareers: ["Marketing Manager", "Brand Strategist", "Digital Marketer"],
      keySkills: ["Marketing Strategy", "Content Creation", "Analytics", "Communication"]
    },
    {
      id: "environmental-science",
      title: "Environmental Science",
      category: "Natural Sciences",
      matchPercentage: 68,
      description: "Study the environment and develop solutions for environmental challenges.",
      matchReasons: [
        "Research interest detected",
        "Science in your skill set",
        "Problem-solving strength",
        "Interest in making impact"
      ],
      medianSalary: "$71,000",
      jobGrowth: "+8%",
      topCareers: ["Environmental Consultant", "Sustainability Analyst", "Research Scientist"],
      keySkills: ["Research", "Data Analysis", "Field Work", "Scientific Writing"]
    }
  ];

  return majors;
};

export function ResultsDashboard({ 
  assessmentData, 
  onSelectMajor, 
  onSaveFavorite,
  savedMajors 
}: ResultsDashboardProps) {
  const [expandedMajor, setExpandedMajor] = useState<string | null>(null);
  const majors = generateMajors(assessmentData);
  const topThree = majors.slice(0, 3);
  const others = majors.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff]">
      {/* Header */}
      <div className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Majorly
            </span>
          </div>
          <Button variant="outline" className="rounded-full">
            View Profile
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#10B981]/20 mb-4">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm text-[#1e293b]">Assessment Complete!</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Your Top Academic Matches
          </h1>
          <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
            Based on your unique profile, we've found {majors.length} majors that align perfectly with your skills and interests.
          </p>
        </motion.div>

        {/* Top 3 Featured Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topThree.map((major, index) => (
            <motion.div
              key={major.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden h-full border-2 hover:border-[#4F46E5] transition-all hover:shadow-xl">
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-[#f59e0b] to-[#10B981] text-white px-4 py-1 rounded-bl-2xl">
                    <span className="text-sm font-semibold">Best Match</span>
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  {/* Match Circle */}
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 352" }}
                        animate={{
                          strokeDasharray: `${(major.matchPercentage / 100) * 352} 352`,
                        }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-[#4F46E5]">
                        {major.matchPercentage}%
                      </span>
                      <span className="text-xs text-[#64748b]">Match</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="rounded-full">
                      {major.category}
                    </Badge>
                    <h3 className="text-2xl font-bold">{major.title}</h3>
                    <p className="text-sm text-[#64748b]">{major.description}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="text-center">
                      <DollarSign className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                      <p className="text-xs text-[#64748b]">Median Salary</p>
                      <p className="font-semibold">{major.medianSalary}</p>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                      <p className="text-xs text-[#64748b]">Job Growth</p>
                      <p className="font-semibold">{major.jobGrowth}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => onSaveFavorite(major.id)}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          savedMajors.includes(major.id) 
                            ? "fill-red-500 text-red-500" 
                            : ""
                        }`} 
                      />
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                      onClick={() => onSelectMajor(major.id)}
                    >
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* See Why */}
                  <button
                    onClick={() => setExpandedMajor(expandedMajor === major.id ? null : major.id)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-[#4F46E5] hover:text-[#7C3AED] transition-colors"
                  >
                    <Badge variant="secondary" className="rounded-full">
                      See Why This Matches
                    </Badge>
                    {expandedMajor === major.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expanded Reasons */}
                  {expandedMajor === major.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 pt-4 border-t"
                    >
                      {major.matchReasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span className="text-[#64748b]">{reason}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Other Matches */}
        {others.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">More Great Matches</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.map((major, index) => (
                <motion.div
                  key={major.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all border hover:border-[#4F46E5]">
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="rounded-full text-xs">
                          {major.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full -mt-1"
                          onClick={() => onSaveFavorite(major.id)}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              savedMajors.includes(major.id) 
                                ? "fill-red-500 text-red-500" 
                                : ""
                            }`} 
                          />
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-1">{major.title}</h3>
                        <p className="text-sm text-[#64748b] line-clamp-2">
                          {major.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748b]">Match</span>
                        <span className="font-bold text-[#4F46E5]">
                          {major.matchPercentage}%
                        </span>
                      </div>
                      <Progress value={major.matchPercentage} className="h-2" />

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => onSelectMajor(major.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-3xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready for a Deeper Dive?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Unlock specializations, detailed career paths, and personalized course recommendations 
            with our Deep Dive Assessment.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="rounded-full bg-white text-[#4F46E5] hover:bg-white/90 px-8"
          >
            Take Deep Dive Test
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
