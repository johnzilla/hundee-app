'use client';

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Navigation } from '@/components/layout/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { GoalCard } from '@/components/goals/goal-card';
import { GoalForm } from '@/components/goals/goal-form';
import { ShareCard } from '@/components/goals/share-card';
import { HundeeWall } from '@/components/goals/hundee-wall';
import { ContactForm } from '@/components/contact/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { getUserGoals } from '@/lib/goals';
import { Goal } from '@/lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { Plus, Target } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [sharingGoal, setSharingGoal] = useState<Goal | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getUserGoals(user.id);
      setGoals(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setShowGoalForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleShareGoal = (goal: Goal) => {
    setSharingGoal(goal);
    setShowShareCard(true);
  };

  const handleGoalFormSuccess = () => {
    fetchGoals();
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">Hundee</h1>
            <p className="text-lg text-gray-600">Track your journey to 100</p>
          </div>
          <AuthForm />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCreateGoal={handleCreateGoal}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Goals</h1>
              <Button onClick={handleCreateGoal} className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </div>
            
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : goals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first goal and start your journey to 100!
                  </p>
                  <Button onClick={handleCreateGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={fetchGoals}
                    onEdit={handleEditGoal}
                    onShare={handleShareGoal}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'wall' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Hundee Wall</h1>
              <p className="text-muted-foreground">
                Celebrate completed goals from our community
              </p>
            </div>
            <HundeeWall />
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
              <p className="text-muted-foreground">
                We&apos;d love to hear your feedback and suggestions
              </p>
            </div>
            <ContactForm />
          </div>
        )}
      </main>
      
      <GoalForm
        isOpen={showGoalForm}
        onOpenChange={setShowGoalForm}
        goal={editingGoal}
        onSuccess={handleGoalFormSuccess}
      />
      
      <ShareCard
        isOpen={showShareCard}
        onOpenChange={setShowShareCard}
        goal={sharingGoal}
      />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}