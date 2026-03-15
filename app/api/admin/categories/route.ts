import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<{ content: any[] }>(`/categorias`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: response.status });
    }

    const data = response.data as { content: any[] } | any[];
    const categories = Array.isArray((data as any)?.content) ? (data as any).content : Array.isArray(data) ? data : [];
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome } = body;
    if (!nome || nome.length < 3) {
      return NextResponse.json({ message: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
    }
    const response = await apiPost(`/categorias`, { nome });

    if (!response.ok) {
      return NextResponse.json({ message: response.error?.message || "Erro ao criar categoria" }, { status: response.status });
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar categoria" }, { status: 500 });
  }
}
