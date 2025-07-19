import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollTriggeredSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollTriggeredSection({ 
  children, 
  className = "", 
  delay = 0 
}: ScrollTriggeredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
} 