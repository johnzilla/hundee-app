'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Share2, MoreHorizontal, Plus, Minus } from 'lucide-react';
import { Goal } from '@/lib/supabase';
import { updateGoalProgress, deleteGoal } from '@/lib/goals';
import { toast } from 'react-hot-toast';

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
  onEdit: (goal: Goal) => void;
  onShare: (goal: Goal) => void;
}

export function GoalCard({ goal, onUpdate, onEdit, onShare }: GoalCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleProgressChange = async (increment: number) => {
    setUpdating(true);
    try {
      const newProgress = Math.max(0, Math.min(100, goal.progress + increment));
      await updateGoalProgress(goal.id, newProgress);
      onUpdate();
      
      if (newProgress >= 100 && goal.progress < 100) {
        toast.success('🎉 Congratulations! You completed your Hundee!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update progress');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goal.id);
        onUpdate();
        toast.success('Goal deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete goal');
      }
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
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
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {goal.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {goal.is_completed && (
              <Badge variant="default" className="bg-green-500">
                Completed
              </Badge>
            )}
            {goal.is_public && (
              <Badge variant="secondary">
                Public
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(goal)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{goal.progress}/100</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm border ${
                i < goal.progress
                  ? 'bg-primary border-primary'
                  : 'bg-muted border-muted-foreground/20'
              }`}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleProgressChange(-1)}
            disabled={updating || goal.progress === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {goal.progress} / 100
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleProgressChange(1)}
            disabled={updating || goal.progress === 100}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}