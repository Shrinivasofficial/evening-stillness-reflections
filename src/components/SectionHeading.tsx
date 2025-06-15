
import React from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function SectionHeading({ title, description, icon }: SectionHeadingProps) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon && <span>{icon}</span>}
      <div>
        <h2 className="text-xl font-semibold tracking-wide text-black mb-0">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0">{description}</p>}
      </div>
    </div>
  );
}
