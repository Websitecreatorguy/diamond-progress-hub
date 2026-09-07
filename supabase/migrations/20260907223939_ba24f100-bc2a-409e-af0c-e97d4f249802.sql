CREATE TABLE public.project_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  current_website TEXT,
  business_type TEXT,
  needs TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.project_requests TO service_role;

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to project requests"
  ON public.project_requests FOR SELECT TO authenticated USING (false);