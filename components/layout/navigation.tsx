'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, MessageCircle, Plus } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateGoal: () => void;
}

export function Navigation({ activeTab, onTabChange, onCreateGoal }: NavigationProps) {
  return (
    <div className="border-b bg-white/80 backdrop-blur-sm sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">My Goals</span>
              </TabsTrigger>
              <TabsTrigger value="wall" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Hundee Wall</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === 'goals' && (
            <Button onClick={onCreateGoal} className="ml-4">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}