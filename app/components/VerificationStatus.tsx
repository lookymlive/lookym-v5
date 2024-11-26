 "use client"; 
import { FC, useEffect, useCallback, useState } from 'react';
import { useFormState } from 'react-dom';
import { useSession } from 'next-auth/react';

interface Props {
  visible: boolean;
}

interface VerificationResponse {
  success: boolean;
  error: string | null;
}

async function resendVerification(prevState: VerificationResponse, formData: FormData) {
  try {
    const { data: session } = useSession();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        action: 'resend'
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend verification email');
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resend verification email'
    };
  }
}

const VerificationStatus: FC<Props> = ({ visible }) => {
  const { data: session, update: updateSession } = useSession();
  const [hasCheckedVerification, setHasCheckedVerification] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (session?.user?.id && !hasCheckedVerification) {
        setHasCheckedVerification(true);
        await updateSession();
      }
    };
    checkVerification();
  }, [session?.user?.id, updateSession]);

  const handleResendVerification = useCallback(async (prevState: VerificationResponse, formData: FormData) => {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          action: 'resend'
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resend verification email'
      };
    }
  }, [session]);

  const [state, formAction] = useFormState(handleResendVerification, {
    success: false,
    error: null
  } as VerificationResponse);

  useEffect(() => {
    if (state.success) {
      updateSession();
    }
  }, [state.success, updateSession]);

  if (!visible || session?.user?.verified) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          {state.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : state.success ? (
            <p className="text-sm text-blue-700">Please check your inbox to verify your email.</p>
          ) : (
            <div className="text-sm text-blue-700">
              <form action={formAction} className="inline">
                <span>Please verify your email address.</span>
                <button type="submit" className="ml-2 text-blue-800 underline hover:text-blue-600">
                  Resend verification email
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;