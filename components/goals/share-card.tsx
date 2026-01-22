'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Copy, Check } from 'lucide-react';
import { Goal } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
}

export function ShareCard({ isOpen, onOpenChange, goal }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!goal) return null;

  const shareText = `I just completed a Hundee of ${goal.title}! 🎉 ${goal.progress}/100 done on my journey.`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const shareCardElement = document.getElementById('share-card');
      if (!shareCardElement) return;

      const canvas = await html2canvas(shareCardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `hundee-${goal.title.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your Hundee</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card 
            id="share-card"
            className="border-none shadow-none"
            style={{ 
              background: `linear-gradient(135deg, ${goal.color}20, ${goal.color}10)`,
              borderRadius: '16px'
            }}
          >
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl mb-4">{goal.emoji}</div>
                <h2 className="text-2xl font-bold">I did a Hundee!</h2>
                <p className="text-lg">
                  <span className="font-semibold">100 of {goal.title}</span>
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: goal.color }}>
                      {goal.progress}
                    </div>
                    <div className="text-sm text-muted-foreground">completed</div>
                  </div>
                  <div className="text-2xl text-muted-foreground">/</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground">100</div>
                    <div className="text-sm text-muted-foreground">total</div>
                  </div>
                </div>
                {goal.is_completed && (
                  <div className="text-lg font-semibold text-green-600">
                    ✅ Completed!
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Track your own 100s at <span className="font-semibold">Hundee.app</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    by <a href="https://www.endurotechventures.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Enduro Tech Ventures LLC</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCopyText}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleDownloadImage}
              disabled={downloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? 'Downloading...' : 'Download Image'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}