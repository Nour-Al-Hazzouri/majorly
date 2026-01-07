import { Button } from "./ui/button";
import { ArrowRight, CheckCircle, Sparkles, Target, TrendingUp } from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff]">
      {/* Navigation */}
      <nav className="border-b border-white/30 backdrop-blur-md bg-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Majorly
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">How It Works</Button>
            <Button variant="ghost" className="hidden sm:inline-flex">About</Button>
            <Button variant="outline" className="rounded-full">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#4F46E5]/20">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <span className="text-sm text-[#1e293b]">Free Assessment • 10 Minutes</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Find the Major{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                You'll Actually Love
              </span>
            </h1>
            
            <p className="text-xl text-[#64748b] leading-relaxed max-w-xl">
              Your personal academic concierge. Match your unique skills, interests, and aspirations 
              to the perfect college major—backed by 33,000+ career data points.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartAssessment}
                size="lg" 
                className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all text-lg px-8 py-6 shadow-lg shadow-[#4F46E5]/25"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full text-lg px-8 py-6 border-2"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-[#1e293b] font-semibold">50,000+ students</p>
                <p className="text-xs text-[#64748b]">found their perfect major</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/20 to-[#7C3AED]/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
              <div className="space-y-4">
                <div className="h-3 w-32 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full" />
                <div className="h-2 w-48 bg-gray-200 rounded-full" />
                <div className="h-2 w-40 bg-gray-200 rounded-full" />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { label: "Computer Science", match: "94%" },
                    { label: "Data Science", match: "87%" },
                    { label: "Engineering", match: "82%" },
                    { label: "Mathematics", match: "79%" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-xs text-[#64748b] mb-1">{item.label}</p>
                      <p className="text-2xl font-bold text-[#4F46E5]">{item.match}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
            Three simple steps to discover your perfect academic path
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Take the Assessment",
              description: "Answer questions about your skills, interests, and aspirations in just 10 minutes.",
              color: "from-[#4F46E5] to-[#7C3AED]",
            },
            {
              icon: Sparkles,
              title: "Get Your Matches",
              description: "Our AI analyzes 33,000+ data points to find majors that align with your unique profile.",
              color: "from-[#7C3AED] to-[#f59e0b]",
            },
            {
              icon: TrendingUp,
              title: "Explore Careers",
              description: "See detailed insights about each major, including career paths, salaries, and job outlooks.",
              color: "from-[#f59e0b] to-[#10B981]",
            },
          ].map((step, i) => (
            <div key={i} className="relative group">
              <div className="h-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-[#64748b] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-3xl p-12 md:p-16 text-white">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Students Trust Majorly
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              We combine cutting-edge career data with personalized assessments to help you make 
              the most important decision of your academic journey.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "33,000+ career data points",
                "Personalized recommendations",
                "Real salary and job outlook data",
                "Career path exploration",
                "Skills-based matching",
                "Free forever",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Find Your Path?
        </h2>
        <p className="text-xl text-[#64748b] mb-8 max-w-2xl mx-auto">
          Join 50,000+ students who've discovered their perfect major with Majorly.
        </p>
        <Button 
          onClick={onStartAssessment}
          size="lg" 
          className="rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 transition-all text-lg px-12 py-6 shadow-lg shadow-[#4F46E5]/25"
        >
          Start Free Assessment
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                Majorly
              </span>
            </div>
            <p className="text-sm text-[#64748b]">
              © 2026 Majorly. Your academic journey starts here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
