import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { usePositiveNotification } from "@/hooks/usePositiveNotification";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import PositiveNotification from "./PositiveNotification";

export default function UserAuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const { notification, showNotification, hideNotification } = usePositiveNotification();
  const { validateEmail, isValidating } = useEmailValidation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        showNotification("You're signed in!");
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        showNotification("Signed out successfully.");
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
    } catch {
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
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('already registered')) {
          showNotification('This email is already registered. Please try signing in instead.', 'info');
        } else {
          showNotification(error.message, 'info');
        }
      } else {
        showNotification('Account created! You can now sign in.', 'info');
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        showNotification(error.message, 'info');
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
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  if (user) {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <UserIcon size={16} />
            <span>{user.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
            {loading ? <Loader2 size={16} className="mr-1 animate-spin" /> : <LogOut size={16} className="mr-1" />} Sign Out
          </Button>
        </div>
        <PositiveNotification message={notification.message} isVisible={notification.isVisible} onClose={hideNotification} type={notification.type} />
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
      <PositiveNotification message={notification.message} isVisible={notification.isVisible} onClose={hideNotification} type={notification.type} />
    </>
  );
}
