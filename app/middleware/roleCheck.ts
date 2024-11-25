import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function roleMiddleware(
  request: NextRequest,
  allowedRoles: string[]
) {
  const session = await auth();
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!allowedRoles.includes(session.user.role)) {
    return new NextResponse(JSON.stringify({ error: "Not authorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}

export function withRoles(allowedRoles: string[]) {
  return async function middleware(request: NextRequest) {
    return roleMiddleware(request, allowedRoles);
  };
}
