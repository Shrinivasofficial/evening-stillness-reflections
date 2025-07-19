import React from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { Users, Globe, Calendar, Clock, CheckCircle, Shield, Award } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      title: "Software Engineer",
      location: "Bangalore, India",
      avatar: "SE",
      content: "This app helps me unwind after long coding sessions. The evening reflections are simple but effective. The background music is really calming.",
      rating: 5,
      stats: "12-day streak",
      platform: "reddit" as const,
      verified: true,
      badge: "Verified User"
    },
    {
      title: "Product Manager",
      location: "Bangalore, India",
      avatar: "PM",
      content: "The guided meditation sessions are perfect for my evening routine. The ambient sounds and music are so soothing. I love how the habit tracking keeps me motivated to practice daily.",
      rating: 5,
      stats: "Daily visitor",
      platform: "linkedin" as const,
      username: "Product Manager",
      verified: true,
      badge: "Verified User"
    },
    {
      title: "Student",
      location: "Chennai, India",
      avatar: "ST",
      content: "The daily reflection prompts are exactly what I needed. As a student, I need time to decompress after long study sessions. The calming music and peaceful interface help me find clarity.",
      rating: 5,
      stats: "Daily visitor",
      platform: "reddit" as const,
      verified: true,
      badge: "Active Member"
    },
    {
      title: "Marketing Professional",
      location: "Chennai, India",
      avatar: "MP",
      content: "I love how the app tracks my progress and celebrates small wins. The habit building features have made mindfulness a natural part of my routine. The soothing sounds are perfect for evening wind-down.",
      rating: 5,
      stats: "15-day streak",
      platform: "linkedin" as const,
      username: "Marketing Pro",
      verified: true,
      badge: "Verified User"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20">
      <div className="container max-w-6xl mx-auto px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Join 1,200+ visitors from 12 countries who have discovered the power of 
            evening reflection and mindfulness practice.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-slate-600">
              <Shield className="w-5 h-5 text-sky-500" />
              <span className="font-medium">Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <CheckCircle className="w-5 h-5 text-sky-500" />
              <span className="font-medium">Verified Reviews</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Users className="w-5 h-5 text-sky-500" />
              <span className="font-medium">1,200+ Active Visits</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 