// redirect to dashboard
import Link from 'next/link';
import { Show } from '@clerk/nextjs';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl text-center">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          HotelPipe
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          The AI Operating System for Independent Indian Hotels. 
          <br className="hidden sm:block" />
          Capture every lead, automate follow-ups, and increase bookings.
        </p>
        
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {/* What users see if they are ALREADY logged in */}
          <Show when ="signed-in">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </Show>
          
          {/* What users see if they are NOT logged in */}
          <Show when = "signed-out">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-sm font-medium text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-gray-50 transition-colors"
            >
              Register Hotel
            </Link>
          </Show>
        </div>
      </div>
    </main>
  );
}