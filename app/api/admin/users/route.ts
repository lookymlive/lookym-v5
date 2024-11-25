import { NextResponse } from "next/server";
import { auth } from "@/auth";
import startDb from "@/app/lib/db";
import UserModel from "@/app/models/user";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await startDb();
    const users = await UserModel.find({}, 'name email role');

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
