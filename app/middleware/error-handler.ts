import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { MongooseError } from 'mongoose';

export interface ErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function errorHandler(
  error: unknown,
  req: NextRequest
): Promise<NextResponse<ErrorResponse>> {
  console.error('Error:', error);

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors
      },
      { status: 400 }
    );
  }

  if (error instanceof MongooseError) {
    return NextResponse.json(
      {
        error: 'Database error',
        code: error.name
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  const isProduction = process.env.NODE_ENV === 'production';
  return NextResponse.json(
    {
      error: isProduction ? 'Internal server error' : (error as Error).message
    },
    { status: 500 }
  );
}

// Higher-order function to wrap route handlers with error handling
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error, req);
    }
  };
}
