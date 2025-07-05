'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createGoal, updateGoal } from '@/lib/goals';
import { Goal } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface GoalFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSuccess: () => void;
}

const EMOJI_OPTIONS = ['🎯', '📚', '🏃', '💪', '🎨', '🎵', '🍎', '💡', '🌟', '🔥'];
const COLOR_OPTIONS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#EC4899', '#6366F1', '#8B5A2B', '#6B7280', '#14B8A6'
];

export function GoalForm({ isOpen, onOpenChange, goal, onSuccess }: GoalFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    emoji: '🎯',
    color: '#8B5CF6',
    is_public: false,
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        emoji: goal.emoji,
        color: goal.color,
        is_public: goal.is_public,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        emoji: '🎯',
        color: '#8B5CF6',
        is_public: false,
      });
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (goal) {
        await updateGoal(goal.id, formData);
        toast.success('Goal updated successfully!');
      } else {
        await createGoal(formData);
        toast.success('Goal created successfully!');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">What do you want to do 100 of?</Label>
            <Input
              id="title"
              placeholder="e.g., pushups, pages read, sketches"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details about your goal..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choose an emoji</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={formData.emoji === emoji ? "default" : "outline"}
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Choose a color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={formData.color === color ? "default" : "outline"}
                  size="sm"
                  className="h-10 w-10 p-0"
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                >
                  {formData.color === color && <span className="text-white">✓</span>}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
            <Label htmlFor="is_public">
              Make this goal public (show on Hundee Wall when completed)
            </Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}