import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ParallaxHero from "./ParallaxHero";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import UserAuthPanel from "./UserAuthPanel";
import Footer from "./Footer";
import CTAButton from "./CTAButton";
import FloatingParticles from "./FloatingParticles";
import ScrollTriggeredSection from "./ScrollTriggeredSection";

export default function EnhancedLandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20 relative">
      <FloatingParticles />
      {/* Header */}
      <motion.header 
        className="w-full px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-3xl font-light text-slate-800 tracking-wide" style={{ fontFamily: "'Crimson Text', serif" }}>
            Still
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <CTAButton onClick={handleGetStarted} size="sm">
            Start Reflecting
          </CTAButton>
        </div>
      </motion.header>
      
      {/* Parallax Hero Section */}
      <ParallaxHero onGetStarted={handleGetStarted} />

      {/* Stats Section */}
      <ScrollTriggeredSection>
        <StatsSection />
      </ScrollTriggeredSection>

      {/* Features Section */}
      <ScrollTriggeredSection delay={0.2}>
        <FeaturesSection />
      </ScrollTriggeredSection>

      {/* Testimonials Section */}
      <ScrollTriggeredSection delay={0.4}>
        <TestimonialsSection />
      </ScrollTriggeredSection>

      {/* Final CTA Section */}
      <ScrollTriggeredSection delay={0.6}>
        <section className="py-24 bg-gradient-to-r from-sky-50/50 to-blue-50/50">
          <div className="container max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-light text-slate-800" style={{ fontFamily: "'Crimson Text', serif" }}>
                Ready to Begin Your Journey?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Join thousands of people who have transformed their lives through mindful reflection and daily gratitude practice.
              </p>
              <div className="flex justify-center">
                <CTAButton onClick={handleGetStarted} size="lg">
                  Start Reflecting
                </CTAButton>
              </div>
            </motion.div>
          </div>
        </section>
      </ScrollTriggeredSection>

      {/* Auth Modal */}
      {showAuth && (
        <motion.div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full relative border border-sky-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl transition-colors"
            >
              ×
            </button>
            <div className="p-8">
              <UserAuthPanel />
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <Footer />
    </div>
  );
} 