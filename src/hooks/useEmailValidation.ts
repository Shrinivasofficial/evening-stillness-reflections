
import { useState } from 'react';

interface EmailValidationResult {
  isValid: boolean;
  isDeliverable: boolean;
  error?: string;
}

export function useEmailValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = async (email: string): Promise<EmailValidationResult> => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Please enter a valid email address format"
      };
    }

    // Check for obviously invalid domains (very basic list)
    const domain = email.split('@')[1].toLowerCase();
    const obviouslyInvalidDomains = [
      'test.com', 'example.com', 'fake.com', 'invalid.com'
    ];
    
    if (obviouslyInvalidDomains.includes(domain)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Please use a real email address"
      };
    }

    // Advanced validation (but don't let it fail the whole process)
    setIsValidating(true);
    
    try {
      const result = await validateEmailAdvanced(email);
      setIsValidating(false);
      return result;
    } catch (error) {
      setIsValidating(false);
      // If advanced validation fails, we'll still allow the email
      return {
        isValid: true,
        isDeliverable: true,
        error: undefined
      };
    }
  };

  const validateEmailAdvanced = async (email: string): Promise<EmailValidationResult> => {
    const domain = email.split('@')[1].toLowerCase();
    
    // Check for common disposable email domains (reduced list)
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'throwaway.email'
    ];
    
    if (disposableDomains.some(d => domain === d)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Temporary email addresses are not allowed"
      };
    }

    // Check for common typos in popular domains (suggestions only)
    const typoSuggestions = checkForTypos(email, domain);
    if (typoSuggestions) {
      return {
        isValid: false,
        isDeliverable: false,
        error: `Did you mean ${typoSuggestions}?`
      };
    }

    // Try MX record validation but don't fail if it doesn't work
    try {
      const mxValidation = await validateMXRecord(domain);
      if (!mxValidation.isValid) {
        return {
          isValid: false,
          isDeliverable: false,
          error: "This domain doesn't seem to accept emails"
        };
      }
    } catch (error) {
      console.log('MX validation failed, allowing email anyway');
    }

    return {
      isValid: true,
      isDeliverable: true,
      error: undefined
    };
  };

  const checkForTypos = (email: string, domain: string): string | null => {
    const commonTypos = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co'],
      'yahoo.com': ['yaho.com', 'yahoo.co', 'yhoo.com'],
      'hotmail.com': ['hotmai.com', 'hotmail.co'],
      'outlook.com': ['outlok.com', 'outlook.co']
    };

    for (const [correct, typos] of Object.entries(commonTypos)) {
      if (typos.includes(domain)) {
        return email.replace(domain, correct);
      }
    }
    return null;
  };

  const validateMXRecord = async (domain: string): Promise<{isValid: boolean, error?: string}> => {
    try {
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      if (!response.ok) {
        throw new Error('DNS query failed');
      }
      
      const data = await response.json();
      
      // Check if we got a proper response and if there are MX records
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return { isValid: true };
      } else if (data.Status === 3) {
        // NXDOMAIN - domain doesn't exist
        return { 
          isValid: false, 
          error: "This domain doesn't exist" 
        };
      } else {
        return { 
          isValid: false, 
          error: "Domain doesn't accept emails" 
        };
      }
    } catch (error) {
      console.error('MX record validation error:', error);
      // If MX validation fails, we'll allow the email
      throw error;
    }
  };

  return {
    validateEmail,
    isValidating
  };
}
