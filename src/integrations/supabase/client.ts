// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gcimzsbpodeauufwciqt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaW16c2Jwb2RlYXV1ZndjaXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTg3NTQsImV4cCI6MjA2NTU3NDc1NH0.jDkzhX9bC0npLecmAN12yAshZP8jJU_YKgk8OLPRN8c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);