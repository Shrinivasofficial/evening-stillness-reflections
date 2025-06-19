
import { useState } from 'react';
import emailjs from '@emailjs/browser';

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

    // Advanced validation using EmailJS
    setIsValidating(true);
    
    try {
      // You can use EmailJS to send a test email or validate
      // For now, we'll do enhanced client-side validation
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
    // Enhanced validation logic
    const domain = email.split('@')[1];
    
    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'sharklasers.com'
    ];
    
    if (disposableDomains.some(d => domain.toLowerCase().includes(d))) {
      return {
        isValid: false,
        isDeliverable: false,
        error: "Disposable email addresses are not allowed"
      };
    }

    // Check for typos in popular domains
    const popularDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co'],
      'yahoo.com': ['yaho.com', 'yahoo.co', 'yhoo.com'],
      'hotmail.com': ['hotmai.com', 'hotmial.com', 'hotmail.co'],
      'outlook.com': ['outlok.com', 'outlook.co', 'outloo.com']
    };

    for (const [correct, typos] of Object.entries(popularDomains)) {
      if (typos.some(typo => domain.toLowerCase().includes(typo))) {
        return {
          isValid: false,
          isDeliverable: false,
          error: `Did you mean ${email.replace(domain, correct)}?`
        };
      }
    }

    return {
      isValid: true,
      isDeliverable: true,
      error: undefined
    };
  };

  const sendVerificationEmail = async (email: string, verificationCode: string) => {
    try {
      const templateParams = {
        to_email: email,
        verification_code: verificationCode,
        app_name: "Evening Reflection"
      };

      // Initialize EmailJS with your public key
      // You'll need to set these up in your EmailJS dashboard
      const result = await emailjs.send(
        'your_service_id', // Replace with your EmailJS service ID
        'your_template_id', // Replace with your EmailJS template ID
        templateParams,
        'your_public_key' // Replace with your EmailJS public key
      );

      return { success: true, result };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error };
    }
  };

  return {
    validateEmail,
    sendVerificationEmail,
    isValidating
  };
}
