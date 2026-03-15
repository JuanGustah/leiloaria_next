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

    const response = await fetch(`${BACKEND_URL}/leiloes/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Erro ao atualizar leilão" },
        { status: response.status }
      );
    }

    const updatedAuction = await response.json();
    return NextResponse.json(updatedAuction);
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/leiloes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Erro ao excluir leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Leilão excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir leilão" }, { status: 500 });
  }
}
