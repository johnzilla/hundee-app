'use client';

import { SetupChecker } from '@/components/setup/setup-checker';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Hundee Setup</h1>
          <p className="text-lg text-gray-600">Verify your Supabase configuration</p>
        </div>
        
        <SetupChecker />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-purple-600 hover:text-purple-800 underline"
          >
            ← Back to Hundee
          </a>
        </div>
      </div>
    </div>
  );
}