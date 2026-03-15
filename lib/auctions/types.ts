// Enum de status do leilão
export enum StatusLeilao {
  ATIVO = "ATIVO",
  ENCERRADO = "ENCERRADO",
  CANCELADO = "CANCELADO",
}

// Response do leilão - retornado pelo backend
export interface LeilaoResponse {
  id: number;
  status: StatusLeilao;
  inicio: string; // ISO format
  fim: string; // ISO format
  prazoPagamento: string; // ISO format
  nome: string;
  lanceMinimo: number;
  descricao?: string;
  lote?: {
    id: number;
    nome: string;
  };
  itens?: Array<{
    id: number;
    nome: string;
  }>;
}

// Request para criar/atualizar leilão
export interface LeilaoFormData {
  nome: string;
  inicio: string; // YYYY-MM-DDTHH:mm
  fim: string; // YYYY-MM-DDTHH:mm
  prazoPagamento: string; // YYYY-MM-DDTHH:mm
  lanceMinimo: string; // string para input numérico
  descricao?: string;
}

// Request apenas para status
export interface UpdateLeilaoStatusRequest {
  status: StatusLeilao;
}
