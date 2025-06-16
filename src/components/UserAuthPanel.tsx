
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function UserAuthPanel() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If Supabase environment variables are not configured, show a simple fallback
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="text-sm text-gray-500">
        Authentication not configured
      </div>
    );
  }

  // Only import and use Supabase if environment variables are available
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [user, setUser] = React.useState<any>(null);
  const [userLoading, setUserLoading] = React.useState(true);

  React.useEffect(() => {
    // Get session/user info on mount
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user ?? null);
      setUserLoading(false);
    });
    // Listen for login/logout in any tab
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for verification link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (userLoading) {
    return (
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full">
            Login
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  const display = user.user_metadata?.full_name || user.email;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">{display}</span>
      <Button
        variant="secondary"
        className="rounded-full"
        onClick={signOut}
      >
        Logout
      </Button>
    </div>
  );
}
