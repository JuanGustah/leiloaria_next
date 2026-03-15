export interface CategoriaRequest {
  nome: string;
}

export interface CategoriaResponse {
  id: number;
  nome: string;
  subcategorias?: CategoriaResponse[]; 
}
