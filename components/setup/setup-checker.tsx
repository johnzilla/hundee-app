'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { verifySupabaseSetup } from '@/lib/verify-setup';

export function SetupChecker() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const setupResults = await verifySupabaseSetup();
      setResults(setupResults);
    } catch (error) {
      console.error('Setup check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "✓ Working" : "✗ Failed"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Checking Supabase setup...</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <p className="text-muted-foreground mb-4">Unable to check setup</p>
          <Button onClick={runCheck}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const allTablesWorking = Object.values(results.tables).every(Boolean);
  const overallStatus = results.connection && results.auth && allTablesWorking && results.policies;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            Supabase Setup Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600 text-sm">{results.error}</p>
            </div>
          )}

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.connection)}
                <span>Database Connection</span>
              </div>
              {getStatusBadge(results.connection)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.auth)}
                <span>Authentication</span>
              </div>
              {getStatusBadge(results.auth)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(allTablesWorking)}
                  <span>Database Tables</span>
                </div>
                {getStatusBadge(allTablesWorking)}
              </div>
              
              <div className="ml-7 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">• profiles table</span>
                  {getStatusBadge(results.tables.profiles)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">• goals table</span>
                  {getStatusBadge(results.tables.goals)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">• goal_updates table</span>
                  {getStatusBadge(results.tables.goal_updates)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(results.policies)}
                <span>Row Level Security</span>
              </div>
              {getStatusBadge(results.policies)}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={runCheck} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-check Setup
            </Button>
          </div>
        </CardContent>
      </Card>

      {overallStatus ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Supabase is Ready!
            </h3>
            <p className="text-green-700">
              Your database is properly configured and ready to use. You can now create accounts and start tracking your Hundees!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Setup Incomplete
            </h3>
            <div className="text-red-700 space-y-2">
              <p>Some components need attention:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {!results.connection && <li>Database connection failed</li>}
                {!results.auth && <li>Authentication not working</li>}
                {!allTablesWorking && <li>Database tables missing or inaccessible</li>}
                {!results.policies && <li>Row Level Security policies not configured</li>}
              </ul>
              <div className="mt-4 p-3 bg-red-100 rounded border">
                <p className="text-sm font-medium">Next steps:</p>
                <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to SQL Editor</li>
                  <li>Run the migration script from <code>supabase/migrations/20250705210620_dusty_torch.sql</code></li>
                  <li>Refresh this page to verify</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}