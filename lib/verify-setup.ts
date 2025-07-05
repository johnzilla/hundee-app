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
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      results.error = `Connection failed: ${connectionError.message}`;
      return results;
    }
    
    results.connection = true;

    // Test auth functionality
    const { data: authTest, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      results.auth = true;
    }

    // Check if tables exist
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('check_table_exists', { table_name: 'profiles' })
      .then(() => ({ data: true, error: null }))
      .catch(() => ({ data: false, error: 'Tables not found' }));

    if (!tablesError) {
      // Test each table
      const tableTests = await Promise.allSettled([
        supabase.from('profiles').select('count', { count: 'exact', head: true }),
        supabase.from('goals').select('count', { count: 'exact', head: true }),
        supabase.from('goal_updates').select('count', { count: 'exact', head: true }),
      ]);

      results.tables.profiles = tableTests[0].status === 'fulfilled';
      results.tables.goals = tableTests[1].status === 'fulfilled';
      results.tables.goal_updates = tableTests[2].status === 'fulfilled';
    }

    // Test RLS policies by trying to access data (should work even if no data exists)
    const { error: policyError } = await supabase
      .from('goals')
      .select('id')
      .limit(1);
    
    results.policies = !policyError || policyError.code !== 'PGRST116';

  } catch (error: any) {
    results.error = error.message;
  }

  return results;
}