
import { cn } from "@/lib/utils";
import React from "react";

interface SoftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function SoftCard({ children, className, ...props }: SoftCardProps) {
  return (
    <div
      className={cn(
        "bg-white shadow-card rounded-xl p-6 mb-6",
        "border border-border",
        "transition-shadow duration-300 ease-in-out hover:shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
