import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessionUser = getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({
        success: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (error) {
    return NextResponse.json({ success: false, user: null });
  }
}
