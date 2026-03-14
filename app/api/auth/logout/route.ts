import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    // Proxy request to Spring Boot backend
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
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
