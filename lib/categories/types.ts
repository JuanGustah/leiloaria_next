// CategoriaResponse alinhado ao backend
export interface CategoriaResponse {
  id: number;
  nome: string;
  subcategorias: CategoriaResponse[];
}

// CategoriaRequest alinhado ao backend
export interface CategoriaRequest {
  nome: string;
}
