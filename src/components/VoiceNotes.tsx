
import React from "react";
import SoftCard from "./SoftCard";
import SectionHeading from "./SectionHeading";
import { Download, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceNotes() {
  return (
    <SoftCard className="animate-fade-in">
      <SectionHeading title="Voice Notes" />
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="outline"
          disabled // voice recording not implemented yet
          className="rounded-full flex items-center gap-2"
        >
          <ArrowUp size={18} />
          Record Voice
        </Button>
        <Button
          variant="outline"
          disabled // file upload not implemented yet
          className="rounded-full flex items-center gap-2"
        >
          <Download size={18} />
          Upload Note
        </Button>
      </div>
      <div className="text-xs text-gray-400">Voice memos coming soon.</div>
    </SoftCard>
  );
}
