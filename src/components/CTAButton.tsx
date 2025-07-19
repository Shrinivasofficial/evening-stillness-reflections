import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTAButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CTAButton({ 
  onClick, 
  children, 
  variant = "primary", 
  size = "md",
  className = ""
}: CTAButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 overflow-hidden group";
  
  const sizeClasses = {
    sm: "px-6 py-3 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-12 py-6 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-white/90 backdrop-blur-sm text-slate-700 border border-sky-200 hover:bg-white hover:shadow-lg hover:scale-105"
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background for primary variant */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Sparkles effect */}
      <motion.div
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-4 h-4 text-sky-300" />
      </motion.div>
      
      <span className="relative z-10 flex items-center">
        {children}
        <motion.div
          className="ml-2"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </span>
    </motion.button>
  );
} 