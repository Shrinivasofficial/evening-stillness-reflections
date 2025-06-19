
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { usePositiveNotification } from "@/hooks/usePositiveNotification";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import PositiveNotification from "./PositiveNotification";

export default function UserAuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const { notification, showNotification, hideNotification } = usePositiveNotification();
  const { validateEmail, isValidating } = useEmailValidation();

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        setUser(session.user);
      } else if (session?.user) {
        supabase.auth.signOut();
        showNotification('Please verify your email before signing in.', 'info');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at) {
          setUser(session.user);
          showNotification('Welcome back! You\'re successfully logged in.');
          setShowVerificationMessage(false);
        } else {
          supabase.auth.signOut();
          showNotification('Please verify your email before signing in.', 'info');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        showNotification('You\'ve been signed out successfully.');
        setShowVerificationMessage(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [showNotification]);

  const handleEmailChange = async (newEmail: string) => {
    setEmail(newEmail);
    setEmailError("");
    
    if (newEmail.trim() === "") {
      setEmailValidationState('idle');
      return;
    }

    setEmailValidationState('validating');
    
    try {
      const validation = await validateEmail(newEmail);
      
      if (validation.isValid && validation.isDeliverable) {
        setEmailValidationState('valid');
        setEmailError("");
      } else {
        setEmailValidationState('invalid');
        setEmailError(validation.error || "Please enter a valid email address");
      }
    } catch (error) {
      setEmailValidationState('invalid');
      setEmailError("Unable to validate email. Please try again.");
    }
  };

  const getEmailInputIcon = () => {
    switch (emailValidationState) {
      case 'validating':
        return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getRedirectUrl = (): string => {
    const currentUrl = window.location.origin;
    console.log('Current URL for redirect:', currentUrl);
    return currentUrl;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailValidationState !== 'valid') {
      showNotification('Please enter a valid email address.', 'info');
      return;
    }
    
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long.', 'info');
      return;
    }
    
    setLoading(true);

    const redirectUrl = getRedirectUrl();
    console.log('Attempting sign up with redirect URL:', redirectUrl);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('already registered')) {
          showNotification('This email is already registered. Please try signing in instead.', 'info');
        } else {
          showNotification(error.message, 'info');
        }
        setShowVerificationMessage(false);
      } else if (data.user && !data.user.email_confirmed_at) {
        console.log('Sign up successful, showing verification message');
        setShowVerificationMessage(true);
        setEmail("");
        setPassword("");
        setEmailValidationState('idle');
      }
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      showNotification('An unexpected error occurred. Please try again.', 'info');
    }
    
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailValidationState === 'invalid') {
      showNotification('Please enter a valid email address.', 'info');
      return;
    }
    
    setLoading(true);

    console.log('Attempting sign in');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Email not confirmed')) {
          showNotification('Please check your email and click the verification link before signing in.', 'info');
        } else if (error.message.includes('Invalid login credentials')) {
          showNotification('Invalid email or password. Please check your credentials.', 'info');
        } else {
          showNotification(error.message, 'info');
        }
      } else if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        showNotification('Please verify your email before signing in.', 'info');
      } else {
        setEmail("");
        setPassword("");
        setEmailValidationState('idle');
      }
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      showNotification('An unexpected error occurred. Please try again.', 'info');
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    console.log('Signing out');
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!email || emailValidationState !== 'valid') {
      showNotification('Please enter a valid email address first.', 'info');
      return;
    }
    
    setLoading(true);
    const redirectUrl = getRedirectUrl();
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        showNotification(error.message, 'info');
      } else {
        showNotification('Verification email sent! Please check your inbox.', 'info');
      }
    } catch (error: any) {
      showNotification('Failed to resend verification email. Please try again.', 'info');
    }
    
    setLoading(false);
  };

  // Show verification message after successful signup
  if (showVerificationMessage) {
    return (
      <>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-sky-600" />
            </div>
            <CardTitle className="text-sky-900">Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a verification link. Please check your email and click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p className="text-sm text-sky-800">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-sky-700 mt-2 space-y-1">
                <li>1. Check your email inbox (and spam folder)</li>
                <li>2. Click the verification link</li>
                <li>3. Return here to sign in</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowVerificationMessage(false)}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
        <PositiveNotification
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
          type={notification.type}
        />
      </>
    );
  }

  if (user) {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <UserIcon size={16} />
            <span>{user.email}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="mr-1 animate-spin" />
            ) : (
              <LogOut size={16} className="mr-1" />
            )}
            Sign Out
          </Button>
        </div>
        <PositiveNotification
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
          type={notification.type}
        />
      </>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to start your reflection journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                      className={`pr-10 ${emailError ? "border-red-500" : emailValidationState === 'valid' ? "border-green-500" : ""}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getEmailInputIcon()}
                    </div>
                  </div>
                  {emailError && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || isValidating || emailValidationState === 'validating'}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                      className={`pr-10 ${emailError ? "border-red-500" : emailValidationState === 'valid' ? "border-green-500" : ""}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getEmailInputIcon()}
                    </div>
                  </div>
                  {emailError && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || isValidating || emailValidationState !== 'valid'}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <PositiveNotification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        type={notification.type}
      />
    </>
  );
}
