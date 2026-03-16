import { NextRequest, NextResponse } from "next/server";
import { apiGet, apiPatch } from "@/lib/api";
import { LeilaoResponse, UpdateLeilaoRequest } from "@/lib/auctions/types";
import { getAuthToken } from "@/lib/auth/getToken";
import { Usuario } from "@/lib/auth";

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

export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext) {
  try {

    const { id } = await params;
    const body: any = await _request.json();

    console.log("[client/leiloes][PATCH] Iniciando criação de leilão");
    console.log("[client/leiloes][PATCH] Campos recebidos:", Object.keys(body || {}));

    const token = await getAuthToken();
    const tokenPreview = token ? `${token.slice(0, 12)}...${token.slice(-8)}` : "ausente";
    console.log("[client/leiloes][PATCH] Token disponível no BFF:", token ? "sim" : "não", "preview:", tokenPreview);
    console.log("[client/leiloes][PATCH] Resolvendo usuário autenticado via GET /users/me (sem body, somente Authorization via api.ts)");

    const meResponse = await apiGet<Usuario>(`/users/me`);
    console.log("[client/leiloes][PATCH] ResPATCHa de /users/me:", {
      ok: meResponse.ok,
      status: meResponse.status,
      hasData: Boolean(meResponse.data),
      hasError: Boolean(meResponse.error),
    });
    if (!meResponse.ok || !meResponse.data?.id) {
      console.log("[client/leiloes][PATCH] Falha ao resolver usuário via /users/me:", meResponse.error);
      return NextResponse.json(
        { message: "Usuário não autenticado" },
        { status: meResponse.status || 401 }
      );
    }
    const idUsuario = meResponse.data.id;
    console.log("[client/leiloes][PATCH] Usuário resolvido:", {
      id: meResponse.data.id,
      email: meResponse.data.email,
      nome: meResponse.data.nome,
    });

    const missingFields: string[] = [];
    if (!body.nome) missingFields.push("nome");
    if (!body.inicio) missingFields.push("inicio");
    if (!body.fim) missingFields.push("fim");
    if (!body.prazoPagamento) missingFields.push("prazoPagamento");
    if (body.lanceMinimo === undefined || body.lanceMinimo === null || body.lanceMinimo === "") missingFields.push("lanceMinimo");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Campos obrigatórios faltando: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!body.itens || body.itens.length === 0) {
      return NextResponse.json(
        { message: "Leilão deve ter pelo menos um item" },
        { status: 400 }
      );
    }

    for (const item of body.itens) {
      if (!item.nome || item.nome.length < 3) {
        return NextResponse.json(
          { message: "Cada item deve ter nome com pelo menos 3 caracteres" },
          { status: 400 }
        );
      }
      if (!item.condicao) {
        return NextResponse.json(
          { message: "Cada item deve ter condição definida" },
          { status: 400 }
        );
      }
      if (!item.categoriasId || item.categoriasId.length === 0) {
        return NextResponse.json(
          { message: "Cada item deve ter pelo menos uma categoria" },
          { status: 400 }
        );
      }
    }

    const leilaoData: UpdateLeilaoRequest = {
      ...body,
      idUsuario,
      lanceMinimo: typeof body.lanceMinimo === "string"
        ? parseFloat(body.lanceMinimo)
        : body.lanceMinimo,
    };

    const response = await apiPatch<LeilaoResponse>(`/leiloes${id}`, leilaoData);
    console.log("[client/leiloes][PATCH] ResPATCHa criação leilão:", {
      ok: response.ok,
      status: response.status,
      hasData: Boolean(response.data),
      hasError: Boolean(response.error),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.error?.message || "Erro ao atualizar leilão" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar leilão:", error);
    return NextResponse.json({ message: "Erro ao atualizar leilão" }, { status: 500 });
  }
}