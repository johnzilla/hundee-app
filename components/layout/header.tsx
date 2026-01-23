'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { signOut, updateProfile } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export function Header() {
  const { user, profile, refreshProfile } = useAuth();
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Sign out failed');
    }
  };

  const handleVisibilityToggle = async (checked: boolean) => {
    if (!user) return;
    setUpdatingVisibility(true);
    try {
      await updateProfile(user.id, { is_public: checked });
      await refreshProfile();
      toast.success(checked ? 'Your goals are now visible on the Hundee Wall' : 'Your goals are now private');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    } finally {
      setUpdatingVisibility(false);
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">
              <span className="text-purple-600">Hundee</span>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              Track your journey to 100
            </div>
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {profile?.full_name || profile?.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Visibility
                </DropdownMenuLabel>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Show on Hundee Wall</span>
                  </div>
                  <Switch
                    checked={profile?.is_public ?? false}
                    onCheckedChange={handleVisibilityToggle}
                    disabled={updatingVisibility}
                  />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}