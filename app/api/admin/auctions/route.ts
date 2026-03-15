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
    const response = await fetch(`${BACKEND_URL}/leiloes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: response.status });
    }
    const data = await response.json();
    // O backend retorna um Page<Leilao>, extrai o content
    const auctions = Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
    return NextResponse.json({ auctions });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar leilões" }, { status: 500 });
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
    const { nome, inicio, fim, prazoPagamento, lanceMinimo, descricao, idUsuario } = body;

    if (!nome || !inicio || !fim || !prazoPagamento || !lanceMinimo || !idUsuario) {
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
      descricao: descricao || "",
      idUsuario,
      itens: [],
    };

    const response = await fetch(`${BACKEND_URL}/leiloes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Erro ao criar leilão" },
        { status: response.status }
      );
    }

    const newAuction = await response.json();
    return NextResponse.json(newAuction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar leilão" }, { status: 500 });
  }
}
