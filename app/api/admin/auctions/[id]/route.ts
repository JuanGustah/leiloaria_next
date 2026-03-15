import { NextRequest, NextResponse } from "next/server";
import { apiPatch, apiDelete } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, inicio, fim, prazoPagamento, lanceMinimo, descricao } = body;

    const payload = {
      nome,
      inicio,
      fim,
      prazoPagamento,
      lanceMinimo: lanceMinimo ? parseFloat(lanceMinimo) : undefined,
      descricao,
      itens: [],
    };

    const response = await apiPatch(`/leiloes/${id}`, payload);

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
