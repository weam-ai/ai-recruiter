"use client";

import { useRouter } from 'next/navigation';

interface NotFoundPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export default function NotFoundPage({ 
  title = "Page Not Found", 
  message = "You need to be authenticated to access this page.",
  showHomeButton = true 
}: NotFoundPageProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {showHomeButton && (
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        )}
      </div>
    </div>
  );
}
