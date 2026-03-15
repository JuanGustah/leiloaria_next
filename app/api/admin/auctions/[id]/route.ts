import { NextRequest, NextResponse } from "next/server";
import { apiPatch, apiDelete } from "@/lib/api";
import { UpdateLeilaoRequest, LeilaoResponse } from "@/lib/auctions/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateLeilaoRequest = await request.json();

    if (body.nome && body.nome.length < 3) {
      return NextResponse.json(
        { message: "Nome deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    const response = await apiPatch<LeilaoResponse>(`/leiloes/${id}`, body);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar leilão" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await apiDelete(`/leiloes/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao excluir leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Leilão excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir leilão" }, { status: 500 });
  }
}
