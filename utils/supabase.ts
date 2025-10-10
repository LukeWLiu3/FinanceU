import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://qmowrpbtkfprkessvrsd.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtb3dycGJ0a2Zwcmtlc3N2cnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDUzODMsImV4cCI6MjA2ODYyMTM4M30.nj43D8wYS2J_GLZXDJq9iYqxObboJIKY3Wl-ZVItsXo"
;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)