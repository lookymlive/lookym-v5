import { NextRequest, NextResponse } from 'next/server';
import { createVerificationToken } from "@/app/utils/auth-utils";
import UserModel from '@/app/models/user';
import { isTokenExpired } from '@/app/utils/auth-utils';
import startDb from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await startDb();
    const user = await UserModel.findOne({
      verificationToken: token,
      verified: false
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    if (isTokenExpired(user.verificationTokenExpiry)) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user verification status
    await UserModel.findByIdAndUpdate(user._id, {
      verified: true,
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpiry: null
    });

    return NextResponse.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await startDb();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const token = await createVerificationToken(user._id);

    // TODO: Send verification email
    // This will be implemented in the next step with email service

    return NextResponse.json({
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
