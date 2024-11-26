'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');

      if (!token || !userId) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, userId }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
          // Update session to reflect verified status
          await update({ verified: true });
          // Redirect to home page after 3 seconds
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong');
      }
    };

    verifyEmail();
  }, [searchParams, router, update]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            )}
            <p className={`mt-2 text-sm ${
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}