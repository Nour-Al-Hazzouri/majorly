import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Search,
  Briefcase,
  Code,
  Users,
  TrendingUp,
  Heart,
  Lightbulb,
  BookOpen,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AssessmentProps {
  onComplete: (data: AssessmentData) => void;
  onClose: () => void;
}

export interface AssessmentData {
  currentSkills: string[];
  aspirations: string[];
  strengths: Record<string, number>;
  interests: Record<string, number>;
}

const AVAILABLE_SKILLS = [
  "Problem Solving", "Critical Thinking", "Communication", "Leadership",
  "Programming", "Data Analysis", "Design", "Writing", "Research",
  "Public Speaking", "Teamwork", "Time Management", "Creativity",
  "Mathematics", "Science", "Art", "Music", "Languages"
];

const ASPIRATION_SKILLS = [
  "Advanced Programming", "Machine Learning", "Business Strategy", "Marketing",
  "Project Management", "Data Visualization", "UI/UX Design", "Content Creation",
  "Financial Analysis", "Healthcare", "Education", "Environmental Science",
  "Artificial Intelligence", "Cybersecurity", "Game Development", "Animation"
];

const STRENGTHS = [
  { id: "analytical", label: "Analytical Thinking", icon: TrendingUp },
  { id: "creative", label: "Creative Expression", icon: Palette },
  { id: "social", label: "Working with People", icon: Users },
  { id: "technical", label: "Technical Skills", icon: Code },
  { id: "leadership", label: "Leadership & Vision", icon: Lightbulb },
  { id: "research", label: "Research & Learning", icon: BookOpen },
];

const INTERESTS = [
  { id: "data", label: "Working with Data", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
  { id: "people", label: "Helping People", icon: Heart, color: "from-pink-500 to-rose-500" },
  { id: "technology", label: "Building Technology", icon: Code, color: "from-purple-500 to-indigo-500" },
  { id: "business", label: "Leading Teams", icon: Briefcase, color: "from-orange-500 to-amber-500" },
  { id: "creative", label: "Creative Work", icon: Palette, color: "from-green-500 to-emerald-500" },
  { id: "research", label: "Research & Discovery", icon: BookOpen, color: "from-indigo-500 to-violet-500" },
];

export function Assessment({ onComplete, onClose }: AssessmentProps) {
  const [step, setStep] = useState(1);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [aspirations, setAspirations] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<Record<string, number>>({});
  const [interests, setInterests] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ currentSkills, aspirations, strengths, interests });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSkill = (skill: string, list: string[], setter: (skills: string[]) => void) => {
    if (list.includes(skill)) {
      setter(list.filter(s => s !== skill));
    } else {
      setter([...list, skill]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return currentSkills.length >= 3;
      case 2:
        return aspirations.length >= 3;
      case 3:
        return Object.keys(strengths).length >= 3;
      case 4:
        return Object.keys(interests).length >= 3;
      default:
        return false;
    }
  };

  const filteredSkills = (skillList: string[]) => {
    return skillList.filter(skill =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="max-w-xl">
            <p className="text-sm text-[#64748b] mb-2">Step {step} of {totalSteps}</p>
            <Progress value={progress} className="h-2 mb-4" />
            <h2 className="text-3xl font-bold">
              {step === 1 && "What skills do you already have?"}
              {step === 2 && "What skills do you want to learn?"}
              {step === 3 && "Rate your natural strengths"}
              {step === 4 && "What interests you most?"}
            </h2>
            <p className="text-[#64748b] mt-2">
              {step === 1 && "Select at least 3 skills that you're confident in today."}
              {step === 2 && "Choose at least 3 skills you're excited to develop."}
              {step === 3 && "Drag the sliders to rate yourself (at least 3)."}
              {step === 4 && "Rate how interested you are in each area (at least 3)."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Current Skills */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                  <Input
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-[#f1f5f9] border-0"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {filteredSkills(AVAILABLE_SKILLS).map((skill) => (
                    <motion.button
                      key={skill}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill, currentSkills, setCurrentSkills)}
                      className={`px-5 py-3 rounded-full border-2 transition-all ${
                        currentSkills.includes(skill)
                          ? "border-[#4F46E5] bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/25"
                          : "border-gray-200 bg-white hover:border-[#4F46E5]/50"
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>

                {currentSkills.length > 0 && (
                  <div className="mt-6 p-4 bg-[#F5F3FF] rounded-2xl">
                    <p className="text-sm text-[#64748b] mb-2">Selected ({currentSkills.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {currentSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-full">
                          {skill}
                          <X 
                            className="w-3 h-3 ml-2 cursor-pointer" 
                            onClick={() => toggleSkill(skill, currentSkills, setCurrentSkills)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Aspirations */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                  <Input
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-[#f1f5f9] border-0"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {filteredSkills(ASPIRATION_SKILLS).map((skill) => (
                    <motion.button
                      key={skill}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill, aspirations, setAspirations)}
                      className={`px-5 py-3 rounded-full border-2 transition-all ${
                        aspirations.includes(skill)
                          ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
                          : "border-gray-200 bg-white hover:border-[#7C3AED]/50"
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>

                {aspirations.length > 0 && (
                  <div className="mt-6 p-4 bg-[#F5F3FF] rounded-2xl">
                    <p className="text-sm text-[#64748b] mb-2">Selected ({aspirations.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {aspirations.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-full">
                          {skill}
                          <X 
                            className="w-3 h-3 ml-2 cursor-pointer" 
                            onClick={() => toggleSkill(skill, aspirations, setAspirations)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Strengths */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {STRENGTHS.map((strength) => {
                  const Icon = strength.icon;
                  const value = strengths[strength.id] || 0;
                  return (
                    <div key={strength.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">{strength.label}</span>
                        </div>
                        {value > 0 && (
                          <Badge variant="secondary" className="rounded-full">
                            {value}%
                          </Badge>
                        )}
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) =>
                          setStrengths({ ...strengths, [strength.id]: newValue })
                        }
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Step 4: Interests */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const rating = interests[interest.id] || 0;
                  return (
                    <motion.div
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                        rating > 0
                          ? "border-[#4F46E5] bg-[#F5F3FF]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => {
                        const newRating = rating === 0 ? 50 : rating;
                        setInterests({ ...interests, [interest.id]: newRating });
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${interest.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{interest.label}</h4>
                          {rating > 0 && (
                            <p className="text-sm text-[#64748b]">Interest Level: {rating}%</p>
                          )}
                        </div>
                      </div>
                      {rating > 0 && (
                        <Slider
                          value={[rating]}
                          onValueChange={([newValue]) =>
                            setInterests({ ...interests, [interest.id]: newValue })
                          }
                          max={100}
                          step={10}
                          className="w-full"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 px-8"
          >
            {step === totalSteps ? "See My Matches" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
