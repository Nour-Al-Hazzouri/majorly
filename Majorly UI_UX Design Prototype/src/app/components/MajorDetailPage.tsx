import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface MajorDetailPageProps {
  majorId: string;
  onBack: () => void;
  onSaveFavorite: (majorId: string) => void;
  isSaved: boolean;
  onTakeDeepDive: () => void;
}

const MAJOR_DETAILS: Record<string, any> = {
  "computer-science": {
    title: "Computer Science",
    category: "STEM",
    matchPercentage: 94,
    hero: {
      tagline: "Build the Future of Technology",
      description: "Computer Science combines theoretical foundations with practical programming skills to solve complex problems and create innovative solutions. From artificial intelligence to cybersecurity, this field offers endless opportunities to make an impact."
    },
    overview: "Computer Science is the study of computation, algorithms, data structures, and the principles that underlie the design of computer systems. Students learn to think logically, solve problems systematically, and create software that powers everything from smartphones to spacecraft.",
    whyMatch: [
      "Your strong problem-solving skills align perfectly with algorithmic thinking",
      "High interest in building technology matches core CS principles",
      "Programming skills in your current toolkit give you a head start",
      "Analytical mindset ideal for debugging and optimization"
    ],
    skillsToMaster: [
      { name: "Programming Languages", level: 90, description: "Python, Java, C++, JavaScript" },
      { name: "Data Structures & Algorithms", level: 95, description: "Core CS fundamentals" },
      { name: "Software Engineering", level: 85, description: "Building scalable systems" },
      { name: "Database Management", level: 80, description: "SQL, NoSQL, data modeling" },
      { name: "Web Development", level: 75, description: "Full-stack development skills" },
      { name: "Computer Networks", level: 70, description: "How systems communicate" }
    ],
    careerPaths: [
      {
        title: "Software Engineer",
        salary: "$120,000",
        growth: "+22%",
        description: "Design, develop, and maintain software applications and systems.",
        companies: ["Google", "Meta", "Amazon", "Microsoft"]
      },
      {
        title: "Data Scientist",
        salary: "$130,000",
        growth: "+28%",
        description: "Extract insights from large datasets using statistical analysis and ML.",
        companies: ["Netflix", "Airbnb", "Uber", "Tesla"]
      },
      {
        title: "AI/ML Engineer",
        salary: "$145,000",
        growth: "+32%",
        description: "Develop intelligent systems that learn and improve from experience.",
        companies: ["OpenAI", "DeepMind", "NVIDIA", "Apple"]
      },
      {
        title: "Cybersecurity Analyst",
        salary: "$105,000",
        growth: "+31%",
        description: "Protect systems and data from cyber threats and attacks.",
        companies: ["Cisco", "Palo Alto", "CrowdStrike", "IBM"]
      }
    ],
    quickStats: {
      medianSalary: "$95,000",
      earlyCareer: "$75,000",
      midCareer: "$120,000",
      jobGrowth: "+22%",
      degreeLength: "4 years",
      employmentRate: "94%"
    },
    topSchools: [
      "MIT", "Stanford", "Carnegie Mellon", "UC Berkeley", "Georgia Tech"
    ],
    typicalCourses: [
      "Introduction to Programming",
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "Database Systems",
      "Software Engineering",
      "Computer Networks",
      "Artificial Intelligence",
      "Machine Learning",
      "Capstone Project"
    ]
  }
};

export function MajorDetailPage({ 
  majorId, 
  onBack, 
  onSaveFavorite, 
  isSaved,
  onTakeDeepDive 
}: MajorDetailPageProps) {
  const major = MAJOR_DETAILS[majorId] || MAJOR_DETAILS["computer-science"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff]">
      {/* Header */}
      <div className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => onSaveFavorite(majorId)}
            >
              <Heart 
                className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} 
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="rounded-full">
              {major.category}
            </Badge>
            <div className="flex items-center gap-2 text-[#10B981]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">{major.matchPercentage}% Match</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {major.title}
          </h1>
          <p className="text-2xl text-[#4F46E5] mb-6">
            {major.hero.tagline}
          </p>
          <p className="text-xl text-[#64748b] max-w-4xl leading-relaxed">
            {major.hero.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[#4F46E5]" />
                Overview
              </h2>
              <p className="text-[#64748b] text-lg leading-relaxed">
                {major.overview}
              </p>
            </Card>

            {/* Why This Matches */}
            <Card className="p-8 bg-gradient-to-br from-[#F5F3FF] to-white border-2 border-[#4F46E5]/20">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-[#4F46E5]" />
                Why This Matches You
              </h2>
              <div className="space-y-4">
                {major.whyMatch.map((reason: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-2xl"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0 mt-1" />
                    <p className="text-[#1e293b] text-lg">{reason}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Skills You'll Master */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-[#4F46E5]" />
                Skills You'll Master
              </h2>
              <div className="space-y-6">
                {major.skillsToMaster.map((skill: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                        <p className="text-sm text-[#64748b]">{skill.description}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">
                        {skill.level}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: i * 0.05 + 0.3 }}
                        className="h-full bg-gradient-to-r from-[#4F46E5] to-[#10B981]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Career Paths */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-[#4F46E5]" />
                Career Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {major.careerPaths.map((career: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-gradient-to-br from-white to-[#F5F3FF] rounded-2xl border border-gray-200 hover:border-[#4F46E5] transition-all hover:shadow-lg"
                  >
                    <h4 className="text-xl font-bold mb-2">{career.title}</h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{career.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{career.growth}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#64748b] mb-3">{career.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {career.companies.slice(0, 3).map((company: string) => (
                        <Badge key={company} variant="outline" className="rounded-full text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Typical Courses */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Typical Courses</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {major.typicalCourses.map((course: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-[#F5F3FF] rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <span className="text-sm">{course}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats - Sticky */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Median Salary</p>
                    <p className="text-2xl font-bold text-[#10B981]">
                      {major.quickStats.medianSalary}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#64748b]">
                      <span>Early: {major.quickStats.earlyCareer}</span>
                      <span>•</span>
                      <span>Mid: {major.quickStats.midCareer}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#64748b]">Job Growth</span>
                      <span className="font-bold text-[#10B981]">{major.quickStats.jobGrowth}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#64748b]">Employment Rate</span>
                      <span className="font-bold">{major.quickStats.employmentRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#64748b]">Degree Length</span>
                      <span className="font-bold">{major.quickStats.degreeLength}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Top Schools */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#4F46E5]" />
                  Top Schools
                </h3>
                <div className="space-y-2">
                  {major.topSchools.map((school: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-[#F5F3FF] rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm font-medium">{school}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white border-0">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">
                  Go Even Deeper
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  Unlock specializations, detailed course plans, and personalized recommendations.
                </p>
                <Button 
                  onClick={onTakeDeepDive}
                  variant="secondary"
                  className="w-full rounded-full bg-white text-[#4F46E5] hover:bg-white/90"
                >
                  Take Deep Dive Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
