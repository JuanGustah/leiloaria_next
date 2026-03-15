import { CondicaoItem, ItemRequest, UpdateItemRequest } from "@/lib/auctions/items";

export enum StatusLeilao {
  ATIVO = "ATIVO",
  ENCERRADO = "ENCERRADO",
  CANCELADO = "CANCELADO",
}

export interface LeilaoRequest {
  nome: string;
  inicio: string; 
  fim: string;
  prazoPagamento: string; 
  lanceMinimo: number;
  descricao?: string;
  idUsuario: number; 
  itens: ItemRequest[]; 
}


export interface UpdateLeilaoRequest {
  nome?: string;
  inicio?: string; 
  fim?: string;
  prazoPagamento?: string;
  lanceMinimo?: number;
  descricao?: string;
  itens?: UpdateItemRequest[];
}

export interface UpdateLeilaoStatusRequest {
  status: StatusLeilao;
}


export interface LeilaoResponse {
  id: number;
  status: StatusLeilao;
  inicio: string; 
  fim: string; 
  prazoPagamento: string;
  nome: string;
  lanceMinimo: number;
  descricao?: string;
  idUsuario?: number;
  lote?: {
    id: number;
    nome: string;
  };
  itens?: Array<{
    id: number;
    nome: string;
    descricao?: string;
    condicao?: string;
  }>;
}

export interface LeilaoFormData {
  nome: string;
  inicio: string; 
  fim: string; 
  prazoPagamento: string; 
  lanceMinimo: string; 
  descricao?: string;
  itens: ItemFormData[]; 
}

export interface ItemFormData {
  idItem?: number;
  nome: string;
  descricao?: string;
  condicao: CondicaoItem;
  imagens?: string[];
  categoriasId: number[];
}
