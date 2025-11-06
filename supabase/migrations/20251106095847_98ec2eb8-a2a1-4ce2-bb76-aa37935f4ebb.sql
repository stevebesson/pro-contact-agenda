-- Make user_id columns NOT NULL to enforce RLS policies
-- This prevents security vulnerabilities where records could exist without user ownership

-- Update contacts table
ALTER TABLE public.contacts 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update notes table
ALTER TABLE public.notes 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update notifications table
ALTER TABLE public.notifications 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update rendez_vous table
ALTER TABLE public.rendez_vous 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Add indexes for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_user_id ON public.rendez_vous(user_id);