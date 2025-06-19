
import { useState } from 'react';

interface EmailValidationResult {
  isValid: boolean;
  isDeliverable: boolean;
  error?: string;
}

export function useEmailValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = async (email: string): Promise<EmailValidationResult> => {
    // Very basic email format validation - only reject obviously invalid formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Please enter a valid email address format"
      };
    }

    // Only check for a very small list of obviously fake domains
    const domain = email.split('@')[1].toLowerCase();
    const obviouslyFakeDomains = [
      'test.com', 'example.com', 'fake.com'
    ];
    
    if (obviouslyFakeDomains.includes(domain)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Please use a real email address"
      };
    }

    // For most emails, just return valid without complex validation
    // Only do basic checks that won't fail
    setIsValidating(true);
    
    try {
      // Just a quick check for very common typos, but don't fail otherwise
      const suggestion = checkForCommonTypos(email, domain);
      if (suggestion) {
        setIsValidating(false);
        return {
          isValid: false,
          isDeliverable: false,
          error: `Did you mean ${suggestion}?`
        };
      }

      // If no obvious issues, mark as valid
      setIsValidating(false);
      return {
        isValid: true,
        isDeliverable: true,
        error: undefined
      };
    } catch (error) {
      setIsValidating(false);
      // Always fallback to valid if any error occurs
      return {
        isValid: true,
        isDeliverable: true,
        error: undefined
      };
    }
  };

  const checkForCommonTypos = (email: string, domain: string): string | null => {
    // Only check for the most common typos
    const commonTypos = {
      'gmail.com': ['gmai.com', 'gmial.com'],
      'yahoo.com': ['yaho.com', 'yhoo.com'],
      'hotmail.com': ['hotmai.com']
    };

    for (const [correct, typos] of Object.entries(commonTypos)) {
      if (typos.includes(domain)) {
        return email.replace(domain, correct);
      }
    }
    return null;
  };

  return {
    validateEmail,
    isValidating
  };
}
