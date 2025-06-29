-- Ensure reflections table has unique constraint for one reflection per day per user
-- This prevents multiple reflections on the same day

-- Add the unique constraint if it doesn't exist
ALTER TABLE public.reflections ADD CONSTRAINT IF NOT EXISTS reflections_user_id_date_key UNIQUE (user_id, date);

-- Add a comment to document the constraint
COMMENT ON TABLE public.reflections IS 'Users can have only one reflection per day'; 