import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://gbweuguxpqjpvnnofuqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdid2V1Z3V4cHFqcHZubm9mdXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1OTUyNzgsImV4cCI6MjAwMzE3MTI3OH0.0F4jDs3TcPlhSTtXrQuJvJauKoLHSHXmnas-TQtu9Fk';

const supabse = createClient(supabaseUrl, supabaseKey);

export { supabse }
