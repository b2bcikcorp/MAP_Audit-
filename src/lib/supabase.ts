import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://hnmydfafjghtrsrzpbtm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubXlkZmFmamdodHJzcnpwYnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzA3MTYsImV4cCI6MjA4NjMwNjcxNn0.kRcdMhT4s-tUfPAfMIOEL-wi63UuBMqjN9rR8ThNA_s'
);
