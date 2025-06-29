-- Create a table to store meditation logs
CREATE TABLE public.meditation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  music TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meditation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access to their own meditation logs
CREATE POLICY "Users can view their own meditation logs" 
  ON public.meditation_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meditation logs" 
  ON public.meditation_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation logs" 
  ON public.meditation_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation logs" 
  ON public.meditation_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX idx_meditation_logs_user_date ON public.meditation_logs(user_id, date DESC); 