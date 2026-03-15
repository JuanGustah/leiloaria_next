import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPost } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<{ content: any[] }>(`/leiloes`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: response.status });
    }

    const data = response.data;
    const auctions = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
    return NextResponse.json({ auctions });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, inicio, fim, prazoPagamento, lanceMinimo, descricao } = body;

    if (!nome || !inicio || !fim || !prazoPagamento || !lanceMinimo) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const payload = {
      nome,
      inicio,
      fim,
      prazoPagamento,
      lanceMinimo: parseFloat(lanceMinimo),
      descricao,
    };

    const response = await apiPost(`/leiloes`, payload);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao criar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar leilão" }, { status: 500 });
  }
}
