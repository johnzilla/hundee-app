import { supabase } from './supabase';
import type { Goal, GoalUpdate } from './supabase';

export async function createGoal(goal: {
  title: string;
  description?: string;
  emoji?: string;
  color?: string;
  is_public?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        user_id: user.id,
        title: goal.title,
        description: goal.description || '',
        emoji: goal.emoji || '🎯',
        color: goal.color || '#8B5CF6',
        is_public: goal.is_public || false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(goalId: string, updates: Partial<Goal>) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGoal(goalId: string) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
}

export async function getUserGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPublicGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      profiles!inner (
        username,
        full_name
      )
    `)
    .eq('is_public', true)
    .eq('profiles.is_public', true)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function updateGoalProgress(goalId: string, newProgress: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get current goal to track previous progress
  const { data: currentGoal, error: fetchError } = await supabase
    .from('goals')
    .select('progress')
    .eq('id', goalId)
    .single();

  if (fetchError) throw fetchError;

  // Update goal progress
  const isCompleted = newProgress >= 100;
  const { data, error } = await supabase
    .from('goals')
    .update({ 
      progress: newProgress,
      is_completed: isCompleted,
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;

  // Record the progress update
  const { error: updateError } = await supabase
    .from('goal_updates')
    .insert([
      {
        goal_id: goalId,
        user_id: user.id,
        previous_progress: currentGoal.progress,
        new_progress: newProgress,
      },
    ]);

  if (updateError) throw updateError;

  return data;
}

export async function getGoalUpdates(goalId: string) {
  const { data, error } = await supabase
    .from('goal_updates')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}