import { NextResponse } from "next/server";
import { auth } from "@/auth";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/product";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !['store', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await startDb();
    const body = await req.json();

    const product = await ProductModel.create({
      ...body,
      storeId: session.user.id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
