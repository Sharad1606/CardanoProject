import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rqulnpjsrkpzrnladoxp.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdWxucGpzcmtwenJubGFkb3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDgyNzQsImV4cCI6MjA0NjkyNDI3NH0.4l-HCDY0Vw0v20kHh55cAB9W4i_HBhD12GmjMHxYZ8E"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

 
