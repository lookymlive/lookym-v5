import { NextResponse } from "next/server";
import { auth } from "@/auth";
import startDb from "@/app/lib/db";
import UserModel from "@/app/models/user";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { userId, newRole } = await req.json();
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    await startDb();
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role
    user.role = newRole;
    await user.save();

    return NextResponse.json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
