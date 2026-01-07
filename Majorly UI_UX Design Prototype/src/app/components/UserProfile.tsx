import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Sparkles,
  Heart,
  Clock,
  RefreshCw,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Calendar
} from "lucide-react";

interface UserProfileProps {
  user: { name: string; email: string };
  savedMajors: Array<{
    id: string;
    title: string;
    category: string;
    matchPercentage: number;
    savedDate: string;
  }>;
  onSelectMajor: (majorId: string) => void;
  onRemoveFavorite: (majorId: string) => void;
  onRetakeAssessment: () => void;
  lastAssessmentDate: string;
}

export function UserProfile({
  user,
  savedMajors,
  onSelectMajor,
  onRemoveFavorite,
  onRetakeAssessment,
  lastAssessmentDate
}: UserProfileProps) {
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
            Settings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-xl text-[#64748b]">
            Continue exploring your perfect academic path
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assessment History */}
            <Card className="p-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white border-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Your Assessment</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span>Last taken: {lastAssessmentDate}</span>
                  </div>
                </div>
                <Button
                  onClick={onRetakeAssessment}
                  variant="secondary"
                  className="rounded-full bg-white text-[#4F46E5] hover:bg-white/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
              </div>
              
              <p className="text-white/90 text-lg mb-6">
                Your profile has been analyzed with 33,000+ career data points to find your perfect matches.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold">{savedMajors.length}</p>
                  <p className="text-sm text-white/80">Saved Majors</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <Clock className="w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-white/80">Total Matches</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <Sparkles className="w-6 h-6 mb-2" />
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-sm text-white/80">Top Match</p>
                </div>
              </div>
            </Card>

            {/* Saved Majors */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                  My Saved Majors
                </h2>
                {savedMajors.length > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {savedMajors.length} saved
                  </Badge>
                )}
              </div>

              {savedMajors.length === 0 ? (
                <Card className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No saved majors yet</h3>
                  <p className="text-[#64748b] mb-6">
                    Start exploring and save majors you're interested in
                  </p>
                  <Button
                    onClick={onRetakeAssessment}
                    className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                  >
                    View All Matches
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedMajors.map((major, index) => (
                    <motion.div
                      key={major.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all border-2 hover:border-[#4F46E5] relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onRemoveFavorite(major.id)}
                        >
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        </Button>

                        <Badge variant="secondary" className="rounded-full mb-3">
                          {major.category}
                        </Badge>
                        
                        <h3 className="text-xl font-bold mb-2">{major.title}</h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-[#64748b]">Match Score</span>
                          <span className="text-lg font-bold text-[#4F46E5]">
                            {major.matchPercentage}%
                          </span>
                        </div>

                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${major.matchPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#10B981]"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#64748b] mb-4">
                          <span>Saved {major.savedDate}</span>
                        </div>

                        <Button
                          onClick={() => onSelectMajor(major.id)}
                          variant="outline"
                          size="sm"
                          className="w-full rounded-full"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={onRetakeAssessment}
                  variant="outline"
                  className="w-full justify-start rounded-2xl h-12"
                >
                  <RefreshCw className="w-5 h-5 mr-3" />
                  Retake Assessment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-2xl h-12"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  View All Matches
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-2xl h-12"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Browse All Majors
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#F5F3FF] to-white border-2 border-[#4F46E5]/20">
              <Sparkles className="w-8 h-8 text-[#4F46E5] mb-3" />
              <h3 className="text-xl font-bold mb-2">
                Recommended Resources
              </h3>
              <p className="text-sm text-[#64748b] mb-4">
                Based on your saved majors, here are some helpful resources to explore.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block p-3 bg-white rounded-xl hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-sm mb-1">Computer Science Career Guide</p>
                  <p className="text-xs text-[#64748b]">Learn about career paths and opportunities</p>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-white rounded-xl hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-sm mb-1">Top Online CS Courses</p>
                  <p className="text-xs text-[#64748b]">Start learning before college</p>
                </a>
                <a
                  href="#"
                  className="block p-3 bg-white rounded-xl hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-sm mb-1">Scholarship Opportunities</p>
                  <p className="text-xs text-[#64748b]">Find funding for your education</p>
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white border-0">
              <h3 className="text-xl font-bold mb-2">
                Share Your Results
              </h3>
              <p className="text-sm text-white/90 mb-4">
                Help your friends discover their perfect major too!
              </p>
              <Button
                variant="secondary"
                className="w-full rounded-full bg-white text-[#4F46E5] hover:bg-white/90"
              >
                Share Majorly
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
