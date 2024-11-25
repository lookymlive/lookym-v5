import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // Validate form data
      schema.parse(formData);

      if (!token) {
        throw new Error('Reset token is missing');
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invalid or missing reset token.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-md p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-gray-500">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <Input
              type="password"
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              disabled={status === 'loading'}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={status === 'loading'}
              required
            />
          </div>
        </div>

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert>
            <AlertDescription>
              Password reset successful! Redirecting to login...
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
