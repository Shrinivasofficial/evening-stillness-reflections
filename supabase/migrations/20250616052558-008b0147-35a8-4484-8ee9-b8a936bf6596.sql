
-- Create a table to store user reflections
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  well TEXT NOT NULL,
  short TEXT NOT NULL,
  again TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access to their own reflections
CREATE POLICY "Users can view their own reflections" 
  ON public.reflections 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" 
  ON public.reflections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" 
  ON public.reflections 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections" 
  ON public.reflections 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX idx_reflections_user_date ON public.reflections(user_id, date DESC);
