import { NextRequest, NextResponse } from 'next/server';
import VerificationTokenModel from "@/app/models/verificationToken";
import UserModel from '@/app/models/user';
import startDb from '@/app/lib/db';
import { createVerificationToken } from '@/app/utils/auth-utils';
import { generateVerificationEmail, sendEmail } from '@/app/utils/email-service';
import { rateLimiter } from '@/app/middleware/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { token, userId, action } = await req.json();

    // Handle resend verification email
    if (action === 'resend') {
      // Apply rate limiting for resend
      const rateLimit = await rateLimiter(req, {
        maxRequests: 3,
        windowMs: 60 * 60 * 1000 // 1 hour
      });
      
      if (rateLimit.status === 429) {
        return rateLimit;
      }

      await startDb();
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.verified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        );
      }

      // Generate new verification token
      const newToken = await createVerificationToken(userId);
      
      // Send verification email
      const emailData = generateVerificationEmail(user.email, newToken);
      await sendEmail(emailData);

      return NextResponse.json({ 
        message: 'Verification email sent successfully' 
      });
    }

    // Handle verify email
    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await startDb();

    // Find and validate the verification token
    const verificationToken = await VerificationTokenModel.findOne({ userId });

    if (!verificationToken || !verificationToken.compare(token)) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Update user verification status
    await UserModel.findByIdAndUpdate(userId, {
      verified: true,
      emailVerified: new Date()
    });

    // Delete the verification token
    await VerificationTokenModel.findOneAndDelete({ userId });

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to validate token without verifying
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await startDb();

    const verificationToken = await VerificationTokenModel.findOne({ userId });

    if (!verificationToken || !verificationToken.compare(token)) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
