
import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import BuddhaAnimation from "./BuddhaAnimation";
import CTAButton from "./CTAButton";

interface WelcomeSectionProps {
  onGetStarted?: () => void;
}

export default function WelcomeSection({ onGetStarted }: WelcomeSectionProps) {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative">
        {/* Animated background elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-sky-200/30 to-blue-300/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-sky-300/40 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BuddhaAnimation />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SectionHeading 
              title="Evening Reflection Journal" 
              description="A minimalist space for clarity, stillness, and soft resets." 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <blockquote className="pl-4 border-l-4 border-sky-200 text-slate-600 italic mt-6 text-lg leading-relaxed">
              "Clarity comes from reflection. Power comes from stillness."
            </blockquote>
          </motion.div>
          
          {onGetStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8"
            >
              <CTAButton onClick={onGetStarted} size="lg">
                Start Your Journey
              </CTAButton>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
