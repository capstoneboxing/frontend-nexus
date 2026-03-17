import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient('https://hnjmmfaqvlszhyiruvwl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuam1tZmFxdmxzemh5aXJ1dndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NDczOTMsImV4cCI6MjA4ODQyMzM5M30.TkhzSgs_tWOUjvx9K26M4KxshS9DPzIvaheR9M_e1VE')