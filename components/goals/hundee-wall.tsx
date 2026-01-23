'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPublicGoals } from '@/lib/goals';
import { Goal } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Star } from 'lucide-react';

export function HundeeWall() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicGoals = async () => {
      try {
        const data = await getPublicGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching public goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicGoals();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No public Hundees yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your progress with the community!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl" style={{ color: goal.color }}>
                  {goal.emoji}
                </span>
                <div>
                  <CardTitle className="text-lg">
                    100 of {goal.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    by @{goal.profiles?.username || 'anonymous'}
                  </p>
                </div>
              </div>
              {goal.is_completed ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
              ) : (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  In Progress
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {goal.description && (
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress: {goal.progress}/100</span>
              <span className="text-muted-foreground">
                {goal.is_completed && goal.completed_at
                  ? `Completed ${formatDistanceToNow(new Date(goal.completed_at), { addSuffix: true })}`
                  : `Updated ${formatDistanceToNow(new Date(goal.updated_at), { addSuffix: true })}`
                }
              </span>
            </div>
            
            <div className="grid grid-cols-10 gap-0.5">
              {Array.from({ length: 100 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: i < goal.progress ? goal.color : '#e5e7eb'
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}