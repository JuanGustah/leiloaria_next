import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { LeilaoResponse } from "@/lib/auctions/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ID do leilão é obrigatório" },
        { status: 400 }
      );
    }

    const response = await apiGet<LeilaoResponse>(`/leiloes/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao buscar leilão" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar leilão específico:", error);
    
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}