import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const response = await fetch(`${BACKEND_URL}/categorias/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message || "Erro ao atualizar categoria" }, { status: response.status });
    }
    const updatedCategory = await response.json();
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const response = await fetch(`${BACKEND_URL}/categorias/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message || "Erro ao excluir categoria" }, { status: response.status });
    }
    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir categoria" }, { status: 500 });
  }
}
