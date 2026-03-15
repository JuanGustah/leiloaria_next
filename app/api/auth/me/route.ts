import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";
import { getAuthToken } from "@/lib/auth/getToken";
import { Usuario } from "@/lib/auth/types";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const response = await apiGet<Usuario>(`/users/me`);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erro ao buscar usuário" },
        { status: response.status }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}
