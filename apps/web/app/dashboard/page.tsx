'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { fetchWithAuth } from '@/lib/api'; 

export default function DashboardPage() {
  const { getToken, isLoaded } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (isLoaded) {
      fetchWithAuth('/api/me', getToken)
        .then(setData)
        .catch(console.error);
    }
  }, [isLoaded, getToken]);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">HotelPipe Dashboard</h1>
      <pre className="rounded-md bg-gray-100 p-4 text-sm text-gray-800 shadow-inner">
        {data ? JSON.stringify(data, null, 2) : 'Loading secure data...'}
      </pre>
    </div>
  );
}