import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // Validate email
      schema.parse({ email });

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-gray-500">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
          />
        </div>

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert>
            <AlertDescription>
              If an account exists with this email, you will receive password reset instructions.
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
