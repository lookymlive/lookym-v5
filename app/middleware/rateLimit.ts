import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || ''
});

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,       // 5 requests
  windowMs: 60 * 1000   // per minute
};

const getIP = (request: NextRequest) => {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
};

export async function rateLimiter(
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_CONFIG
) {
  const ip = getIP(request);
  const key = `rate-limit:${ip}`;

  try {
    const [requests, _] = await redis
      .pipeline()
      .incr(key)
      .expire(key, Math.ceil(config.windowMs / 1000))
      .exec();

    const remainingRequests = config.maxRequests - (requests as number);
    const response = NextResponse.next();

    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, remainingRequests).toString());

    if (remainingRequests < 0) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil(config.windowMs / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.windowMs / 1000).toString()
          }
        }
      );
    }

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open - allow request to proceed if rate limiting fails
    return NextResponse.next();
  }
}
