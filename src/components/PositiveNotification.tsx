
import React, { useEffect, useState } from "react";
import { Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositiveNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'info';
}

const positiveMessages = {
  'email verification sent': "📧 A verification link has been sent to your email! Please check your inbox and click the link to activate your account.",
  'please check your email to verify your account': "📧 A verification link has been sent to your email! Please check your inbox and click the link to activate your account.",
  'reflection saved': "🌟 Your beautiful reflection has been safely stored. You're building something wonderful!",
  'reflection saved successfully': "🌟 Your beautiful reflection has been safely stored. You're building something wonderful!",
  'welcome back': "🙏 Welcome back, peaceful soul. Your journey of reflection continues.",
  'signed out': "☮️ Until we meet again. May peace be with you.",
  'you\'ve been signed out successfully': "☮️ Until we meet again. May peace be with you.",
  'default': "✨ Something wonderful just happened! Keep shining bright."
};

export default function PositiveNotification({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success' 
}: PositiveNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, type === 'info' ? 6000 : 4000); // Show info messages longer
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, type]);

  if (!isVisible && !show) return null;

  const getPositiveMessage = (originalMessage: string) => {
    const key = Object.keys(positiveMessages).find(k => 
      originalMessage.toLowerCase().includes(k.toLowerCase())
    );
    return key ? positiveMessages[key as keyof typeof positiveMessages] : positiveMessages.default;
  };

  const getIcon = () => {
    if (type === 'info') {
      return <Info className="w-5 h-5 text-sky-600" />;
    }
    return <Check className="w-5 h-5 text-green-600" />;
  };

  const getBackgroundColor = () => {
    if (type === 'info') {
      return 'bg-sky-100';
    }
    return 'bg-green-100';
  };

  const getBorderColor = () => {
    if (type === 'info') {
      return 'border-sky-200';
    }
    return 'border-green-200';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      show ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
    }`}>
      <div className={`bg-white border ${getBorderColor()} rounded-lg shadow-lg p-4 max-w-md`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${getBackgroundColor()} rounded-full flex items-center justify-center`}>
              {getIcon()}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800 leading-relaxed">
              {getPositiveMessage(message)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
