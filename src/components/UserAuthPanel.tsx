
import React from "react";
import { Button } from "@/components/ui/button";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function UserAuthPanel() {
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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get session/user info on mount
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });
    // Listen for login/logout in any tab
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        className="rounded-full"
        onClick={signInWithGoogle}
      >
        Login with Google
      </Button>
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
