import crypto from 'crypto';
import { IUser } from '../models/user';
import UserModel from '../models/user';

interface ExtendedUser extends IUser {
  _id?: string;
  lockUntil?: Date;
  failedLoginAttempts?: number;
}

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateTokenExpiry = (hours: number = 24) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

export const isUserLocked = (user: ExtendedUser): boolean => {
  if (!user.lockUntil) return false;
  return user.lockUntil > new Date();
};

export const incrementLoginAttempts = async (user: ExtendedUser) => {
  const attempts = (user.failedLoginAttempts || 0) + 1;
  let updates: Partial<ExtendedUser> = { failedLoginAttempts: attempts };

  if (attempts >= 5) {
    updates.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // Lock for 1 hour
  }

  await UserModel.updateOne({ _id: user._id }, { $set: updates });
};

export const resetLoginAttempts = async (userId: string) => {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        failedLoginAttempts: 0,
        lockUntil: null
      }
    }
  );
};

export const createVerificationToken = async (userId: string) => {
  const token = generateToken();
  const expiry = generateTokenExpiry(24); // 24 hours

  await UserModel.findByIdAndUpdate(userId, {
    verificationToken: token,
    verificationTokenExpiry: expiry
  });

  return token;
};

export const createPasswordResetToken = async (userId: string) => {
  const token = generateToken();
  const expiry = generateTokenExpiry(1); // 1 hour

  await UserModel.findByIdAndUpdate(userId, {
    resetPasswordToken: token,
    resetPasswordTokenExpiry: expiry
  });

  return token;
};

export const isTokenExpired = (date?: Date) => {
  if (!date) return true;
  return date.getTime() < Date.now();
};
