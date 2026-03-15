import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8080"}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { authorization: authHeader }),
      },
    });

    const data = await response.json();

    if (response.ok) {
      const cookieStore = await cookies();
      cookieStore.delete("token");
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
