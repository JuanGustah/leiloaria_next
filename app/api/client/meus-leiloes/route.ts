import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const response = await apiGet<{ content: any[] }>(`/leiloes/meus`);

    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: response.status });
    }

    const data = response.data;
    // O backend retorna um Page<Leilao>, extrai o content
    const auctions = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
    return NextResponse.json({ auctions });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: 500 });
  }
}
