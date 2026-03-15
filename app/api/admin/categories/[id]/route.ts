import { NextRequest, NextResponse } from "next/server";
import { apiPatch, apiDelete } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome } = body;
    if (!nome || nome.length < 3) {
      return NextResponse.json({ message: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
    }
    const response = await apiPatch(`/categorias/${id}`, { nome });

    if (!response.ok) {
      return NextResponse.json({ message: response.error?.message || "Erro ao atualizar categoria" }, { status: response.status });
    }

    return NextResponse.json(response.data);
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
    const response = await apiDelete(`/categorias/${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: response.error?.message || "Erro ao excluir categoria" }, { status: response.status });
    }

    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir categoria" }, { status: 500 });
  }
}
