-- Create meditation_logs table
CREATE TABLE IF NOT EXISTS public.meditation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    duration INTEGER NOT NULL, -- duration in seconds
    music TEXT[] DEFAULT '{}', -- array of music track names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meditation_logs_user_id ON public.meditation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_logs_date ON public.meditation_logs(date);
CREATE INDEX IF NOT EXISTS idx_meditation_logs_user_date ON public.meditation_logs(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.meditation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own meditation logs" ON public.meditation_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation logs" ON public.meditation_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation logs" ON public.meditation_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation logs" ON public.meditation_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_meditation_logs_updated_at 
    BEFORE UPDATE ON public.meditation_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 