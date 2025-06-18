
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Mail } from "lucide-react";
import { usePositiveNotification } from "@/hooks/usePositiveNotification";
import PositiveNotification from "./PositiveNotification";

export default function UserAuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { notification, showNotification, hideNotification } = usePositiveNotification();

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        showNotification('Welcome back! You\'re successfully logged in.');
        setShowVerificationMessage(false);
      } else if (event === 'SIGNED_OUT') {
        showNotification('You\'ve been signed out successfully.');
        setShowVerificationMessage(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [showNotification]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get the current domain for redirect
    const currentDomain = window.location.origin;
    console.log('Attempting sign up with redirect URL:', currentDomain);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: currentDomain
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      showNotification(error.message, 'info');
      setShowVerificationMessage(false);
    } else {
      console.log('Sign up successful, showing verification message');
      setShowVerificationMessage(true);
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting sign in');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      if (error.message.includes('Email not confirmed')) {
        showNotification('Please check your email and click the verification link before signing in.', 'info');
      } else {
        showNotification(error.message, 'info');
      }
    } else {
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    console.log('Signing out');
    await supabase.auth.signOut();
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
                <li>1. Check your email inbox</li>
                <li>2. Click the verification link</li>
                <li>3. Return here to sign in</li>
              </ol>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowVerificationMessage(false)}
              className="w-full"
            >
              Back to Sign In
            </Button>
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
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut size={16} className="mr-1" />
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
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
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
