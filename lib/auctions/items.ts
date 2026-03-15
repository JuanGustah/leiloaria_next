export enum CondicaoItem {
  NOVO = "NOVO",
  MUITO_BOM = "MUITO_BOM",
  BOM = "BOM",
  USADO = "USADO",
  PARA_REFORMA = "PARA_REFORMA",
}

export interface ItemRequest {
  nome: string; 
  descricao?: string; 
  condicao: CondicaoItem;
  imagens?: string[];
  categoriasId: number[]; 
}

export interface UpdateItemRequest {
  idItem: number;
  nome?: string;
  descricao?: string; 
  condicao?: CondicaoItem;
  imagens?: string[];
  categoriasId?: number[];
}

export interface ItemResponse {
  id: number;
  nome: string;
  descricao?: string;
  condicao: CondicaoItem;
  imagens?: string[];
  categorias?: Array<{
    id: number;
    nome: string;
  }>;
}
