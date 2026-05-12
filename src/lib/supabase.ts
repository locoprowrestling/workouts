import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://muxaahabjqqwnwxjrfme.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eGFhaGFianFxd253eGpyZm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDExNDUsImV4cCI6MjA5NDE3NzE0NX0.flNnoHK4AEfepKNwzDG6KqhulVHI6rEwvxfiAbY-Ll4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
