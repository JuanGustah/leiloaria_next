import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const response = await fetch(`${BACKEND_URL}/categorias`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: response.status });
    }
    const data = await response.json();
    // O backend retorna um Page<Categoria>, extrai o content
    const categories = Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { nome } = body;
    if (!nome || nome.length < 3) {
      return NextResponse.json({ message: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
    }
    const response = await fetch(`${BACKEND_URL}/categorias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message || "Erro ao criar categoria" }, { status: response.status });
    }
    const newCategory = await response.json();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar categoria" }, { status: 500 });
  }
}
