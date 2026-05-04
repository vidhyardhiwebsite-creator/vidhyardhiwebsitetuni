import { createClient } from "@supabase/supabase-js"

// Direct values - update these when deploying
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dutroxipxwtxnhgijzoe.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dHJveGlweHd0eG5oZ2lqem9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDkwODksImV4cCI6MjA5MzMyNTA4OX0.xk25Kdyw4EDhcCuGaL0JHTwXcz_9-DnfwinmfNDmG2w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
