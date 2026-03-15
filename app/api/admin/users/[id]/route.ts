import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[PUT /api/admin/users/:id] Iniciando atualização do usuário:", id);

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("[PUT /api/admin/users/:id] Token não encontrado");
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }
    console.log("[PUT /api/admin/users/:id] Token obtido com sucesso");

    const body = await request.json();
    const { nome, email, cpf, dataNascimento, telefone } = body;
    console.log("[PUT /api/admin/users/:id] Dados recebidos:", { nome, email, cpf, dataNascimento, telefone });

    // Validação básica
    if (!nome || !email || !cpf || !dataNascimento) {
      console.log("[PUT /api/admin/users/:id] Validação falhou - campos obrigatórios ausentes");
      return NextResponse.json(
        { message: "Nome, e-mail, CPF e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    // Prepara o payload para enviar ao backend
    const userPayload = {
      nome,
      email,
      cpf,
      dataNascimento,
      telefone: Array.isArray(telefone) ? telefone : [],
    };
    console.log("[PUT /api/admin/users/:id] Payload preparado:", userPayload);

    const url = `${BACKEND_URL}/users/${id}`;
    console.log("[PUT /api/admin/users/:id] Enviando requisição para:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    console.log("[PUT /api/admin/users/:id] Resposta do backend - Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[PUT /api/admin/users/:id] Erro do backend:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Erro ao atualizar usuário" },
        { status: response.status }
      );
    }

    const updatedUser = await response.json();
    console.log("[PUT /api/admin/users/:id] Usuário atualizado com sucesso:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PUT /api/admin/users/:id] Erro:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar usuário" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Erro ao excluir usuário" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { message: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }
}
