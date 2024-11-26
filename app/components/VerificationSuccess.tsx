'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Props {
  message?: string;
}

const VerificationSuccess: FC<Props> = ({ message }) => {
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    const updateSession = async () => {
      try {
        await update();
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };

    updateSession();
  }, [router, update]);

  return (
    <div className="text-center px-4 pt-20">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        {message && <p className="text-xl mb-4">{message}</p>}
        <p className="text-lg text-gray-700">Congrats! Your email is verified.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to homepage...</p>
      </div>
    </div>
  );
};

export default VerificationSuccess;