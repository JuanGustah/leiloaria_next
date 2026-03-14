import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginDTO } from "@/lib/auth/types";
import { BACKEND_URL } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body: LoginDTO = await request.json();

    // Simple validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Proxy request to Spring Boot backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Se login for bem-sucedido e houver token, salva em cookie HTTP Only
    if (response.ok && data.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
