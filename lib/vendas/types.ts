export enum FormaPagamento {
  CARTAO = "CARTAO",
  PIX = "PIX",
  BOLETO = "BOLETO",
}

export enum StatusPagamento {
  PENDENTE = "PENDENTE",
  PROCESSANDO = "PROCESSANDO",
  APROVADO = "APROVADO",
  RECUSADO = "RECUSADO",
  CANCELADO = "CANCELADO",
}

export enum BandeiraCartao {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  ELO = "ELO",
  AMEX = "AMEX",
}

export interface VendaResponse {
  id: number;
  valor: number; 
  metodoPagamento?: {
    id?: number;
    statusPagamento?: StatusPagamento;
  };
  lance?: {
    id: number;
    valor: number;
  };
  createdAt: string; 
  updatedAt: string;
}

export interface VendaRequest {
  valor: number; 
  formaPagamento: FormaPagamento;
  lanceId: number; 
  numeroCartao?: string;
  nomeTitular?: string;
  bandeira?: BandeiraCartao;
  diaVencimento?: number;
  anoVencimento?: number;
  urlPagamento?: string;
  id?: number;
}

export interface UpdateVendaRequest {
  statusPagamento: StatusPagamento;
}

export interface VendaFormData {
  valor: string;
  formaPagamento: FormaPagamento | "";
  lanceId: string;
}
