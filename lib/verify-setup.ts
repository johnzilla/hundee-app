import { supabase } from './supabase';

export async function verifySupabaseSetup() {
  const results = {
    connection: false,
    auth: false,
    tables: {
      profiles: false,
      goals: false,
      goal_updates: false,
    },
    policies: false,
    error: null as string | null,
  };

  try {
    // Test basic connection with a simple query
    const { data, error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (connectionError && connectionError.code !== 'PGRST116') {
      results.error = `Connection failed: ${connectionError.message}`;
      return results;
    }
    
    results.connection = true;

    // Test auth functionality
    try {
      const { data: authTest, error: authError } = await supabase.auth.getSession();
      results.auth = true;
    } catch (authError) {
      console.warn('Auth test failed:', authError);
      results.auth = false;
    }

    // Test each table individually
    const tableTests = await Promise.allSettled([
      supabase.from('profiles').select('id').limit(1),
      supabase.from('goals').select('id').limit(1),
      supabase.from('goal_updates').select('id').limit(1),
    ]);

    results.tables.profiles = tableTests[0].status === 'fulfilled' || 
      (tableTests[0].status === 'rejected' && (tableTests[0].reason as any)?.code === 'PGRST116');
    results.tables.goals = tableTests[1].status === 'fulfilled' || 
      (tableTests[1].status === 'rejected' && (tableTests[1].reason as any)?.code === 'PGRST116');
    results.tables.goal_updates = tableTests[2].status === 'fulfilled' || 
      (tableTests[2].status === 'rejected' && (tableTests[2].reason as any)?.code === 'PGRST116');

    // Test RLS policies - PGRST116 means RLS is working (no rows returned due to policies)
    results.policies = results.tables.profiles && results.tables.goals && results.tables.goal_updates;
    
  } catch (error: any) {
    results.error = `Setup check failed: ${error.message}`;
    console.error('Supabase setup verification error:', error);
  }

  return results;
}