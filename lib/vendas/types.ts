// Enums alinhados ao backend
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

// VendaResponse alinhado ao backend
export interface VendaResponse {
  id: number;
  valor: number; // BigDecimal
  metodoPagamento?: {
    id?: number;
    statusPagamento?: StatusPagamento;
  };
  lance?: {
    id: number;
    valor: number;
  };
  createdAt: string; // ISO format LocalDateTime
  updatedAt: string; // ISO format LocalDateTime
}

// VendaRequest alinhado ao backend
export interface VendaRequest {
  valor: number; // BigDecimal (positivo)
  formaPagamento: FormaPagamento;
  lanceId: number; // Long (positivo)
  // Campos opcionais de cartão
  numeroCartao?: string;
  nomeTitular?: string;
  bandeira?: BandeiraCartao;
  diaVencimento?: number;
  anoVencimento?: number;
  // Campo PIX
  urlPagamento?: string;
  id?: number; // Para updates
}

// UpdateVendaRequest alinhado ao backend
export interface UpdateVendaRequest {
  statusPagamento: StatusPagamento;
}

// VendaFormData para o formulário simplificado
export interface VendaFormData {
  valor: string;
  formaPagamento: FormaPagamento | "";
  lanceId: string;
}
