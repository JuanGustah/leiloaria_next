import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<{ content: any[] }>(`/users`);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao buscar usuários" },
        { status: response.status }
      );
    }

    const data = response.data;
    // O backend retorna um Page<UserResponse>, extrai o content
    const users = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { message: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}


