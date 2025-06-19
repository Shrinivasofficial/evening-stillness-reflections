
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

    // Check for common invalid domains
    const domain = email.split('@')[1].toLowerCase();
    const invalidDomains = [
      'test.com', 'example.com', 'fake.com', 'invalid.com', 
      'temp.com', 'dummy.com', '123.com', 'abc.com'
    ];
    
    if (invalidDomains.includes(domain)) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Please use a valid email address"
      };
    }

    // Advanced validation
    setIsValidating(true);
    
    try {
      const result = await validateEmailAdvanced(email);
      setIsValidating(false);
      return result;
    } catch (error) {
      setIsValidating(false);
      return {
        isValid: true, // Fallback to allowing if validation service fails
        isDeliverable: true,
        error: undefined
      };
    }
  };

  const validateEmailAdvanced = async (email: string): Promise<EmailValidationResult> => {
    const domain = email.split('@')[1].toLowerCase();
    
    // Check for disposable email domains (expanded list)
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'sharklasers.com',
      'temp-mail.org', 'throwaway.email', 'maildrop.cc',
      'getnada.com', 'mohmal.com', 'mailnesia.com',
      'trashmail.com', 'dispostable.com', 'tempail.com',
      'emailondeck.com', 'mytrashmail.com', 'spamgourmet.com'
    ];
    
    if (disposableDomains.some(d => domain.includes(d))) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Disposable email addresses are not allowed"
      };
    }

    // Check for typos in popular domains
    const popularDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co', 'gmai.co', 'gnail.com'],
      'yahoo.com': ['yaho.com', 'yahoo.co', 'yhoo.com', 'yahooo.com'],
      'hotmail.com': ['hotmai.com', 'hotmial.com', 'hotmail.co', 'hotmial.co'],
      'outlook.com': ['outlok.com', 'outlook.co', 'outloo.com', 'outlok.co'],
      'icloud.com': ['iclod.com', 'icloud.co', 'icloude.com'],
      'protonmail.com': ['protonmai.com', 'protonmail.co', 'protonmial.com']
    };

    for (const [correct, typos] of Object.entries(popularDomains)) {
      if (typos.some(typo => domain.includes(typo))) {
        return {
          isValid: false,
          isDeliverable: false,
          error: `Did you mean ${email.replace(domain, correct)}?`
        };
      }
    }

    // MX Record validation using DNS over HTTPS (free)
    try {
      const mxValidation = await validateMXRecord(domain);
      if (!mxValidation.isValid) {
        return {
          isValid: false,
          isDeliverable: false,
          error: mxValidation.error || "Domain does not accept emails"
        };
      }
    } catch (error) {
      console.log('MX validation failed, continuing with other checks');
    }

    // Check for role-based emails (optional validation)
    const roleBasedPrefixes = [
      'admin', 'info', 'support', 'noreply', 'no-reply',
      'contact', 'sales', 'help', 'webmaster', 'postmaster'
    ];
    
    const emailPrefix = email.split('@')[0].toLowerCase();
    if (roleBasedPrefixes.includes(emailPrefix)) {
      return {
        isValid: true, // Still valid but with warning
        isDeliverable: true,
        error: "Role-based emails may not receive important notifications"
      };
    }

    return {
      isValid: true,
      isDeliverable: true,
      error: undefined
    };
  };

  const validateMXRecord = async (domain: string): Promise<{isValid: boolean, error?: string}> => {
    try {
      // Use Cloudflare's DNS over HTTPS (free)
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      if (!response.ok) {
        throw new Error('DNS query failed');
      }
      
      const data = await response.json();
      
      if (data.Answer && data.Answer.length > 0) {
        return { isValid: true };
      } else {
        return { 
          isValid: false, 
          error: "Domain does not have email servers configured" 
        };
      }
    } catch (error) {
      console.error('MX record validation error:', error);
      return { isValid: true }; // Fallback to allowing if check fails
    }
  };

  // Alternative: Use a free email validation API (Hunter.io has free tier)
  const validateWithHunter = async (email: string): Promise<EmailValidationResult> => {
    try {
      // This would require an API key - uncomment and add your Hunter.io API key if needed
      // const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=YOUR_API_KEY`);
      // const data = await response.json();
      // return { isValid: data.data.result === 'deliverable', isDeliverable: true };
      
      return { isValid: true, isDeliverable: true };
    } catch (error) {
      return { isValid: true, isDeliverable: true };
    }
  };

  return {
    validateEmail,
    isValidating
  };
}
