import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqdjnspaebtfopjlkiow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZGpuc3BhZWJ0Zm9wamxraW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NzU0MDQsImV4cCI6MjA2NjI1MTQwNH0.rfYt1v_y8UMOc8NpZJvRkeAn_mh1u2KldJIl5IZ5GhY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
