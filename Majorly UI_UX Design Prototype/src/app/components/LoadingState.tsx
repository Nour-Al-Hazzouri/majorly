import { motion } from "motion/react";
import { Sparkles, Brain, Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#fdfcff] via-[#F5F3FF] to-[#fdfcff] z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* Animated Brain/Constellation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full opacity-20 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-20 h-20 text-[#4F46E5]" />
            </motion.div>
          </div>
          
          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            >
              <div
                className="w-2 h-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full"
                style={{
                  transform: `translate(${40 + i * 10}px, 0)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent"
          >
            Analyzing Your Profile
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <p className="text-xl text-[#64748b]">
              Matching your unique profile with 33,000+ skills and career data points...
            </p>
            
            {/* Loading steps */}
            <div className="max-w-md mx-auto space-y-2 pt-6">
              {[
                { text: "Processing your skills", delay: 0.5 },
                { text: "Analyzing your interests", delay: 1 },
                { text: "Calculating matches", delay: 1.5 },
                { text: "Finding your perfect majors", delay: 2 },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay }}
                  className="flex items-center gap-3 text-left"
                >
                  <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />
                  <span className="text-[#64748b]">{step.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#f59e0b] rounded-full mx-auto max-w-md"
        />
      </div>
    </div>
  );
}
