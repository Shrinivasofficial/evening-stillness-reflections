
import React from "react";
import SectionHeading from "./SectionHeading";
import BuddhaAnimation from "./BuddhaAnimation";

export default function WelcomeSection() {
  return (
    <div className="mb-8 animate-fade-in">
      <BuddhaAnimation />
      <SectionHeading title="Evening Reflection Journal" description="A minimalist space for clarity, stillness, and soft resets." />
      <blockquote className="pl-4 border-l-4 border-gray-200 text-gray-500 italic mt-4">
        "Clarity comes from reflection. Power comes from stillness."
      </blockquote>
    </div>
  );
}
