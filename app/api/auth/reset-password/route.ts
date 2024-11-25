import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import UserModel from '@/app/models/user';
import { createPasswordResetToken, isTokenExpired } from '@/app/utils/auth-utils';
import { generatePasswordResetEmail, sendEmail } from '@/app/utils/email-service';
import startDb from '@/app/lib/db';
import { rateLimiter } from '@/app/middleware/rateLimit';

// Schema for password reset request
const requestResetSchema = z.object({
  email: z.string().email()
});

// Schema for password reset
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(100)
});

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimit = await rateLimiter(req, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000 // 1 hour
    });
    
    if (rateLimit.status === 429) {
      return rateLimit;
    }

    const body = await req.json();
    const { email } = requestResetSchema.parse(body);

    await startDb();
    const user = await UserModel.findOne({ email });

    // Don't reveal if user exists
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    const token = await createPasswordResetToken(user._id);
    
    // Send password reset email
    const emailData = generatePasswordResetEmail(email, token);
    await sendEmail(emailData);

    return NextResponse.json({
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    await startDb();
    const user = await UserModel.findOne({
      resetPasswordToken: token
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (isTokenExpired(user.resetPasswordTokenExpiry)) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    // Update user password and clear reset token
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null
    });

    return NextResponse.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid password format' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
