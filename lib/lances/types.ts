// LanceResponse alinhado ao backend
export interface LanceResponse {
  id: number;
  timestamp: string; // ISO format LocalDateTime
  valor: number; // BigDecimal
  lote?: {
    id: number;
    nome: string;
  };
  usuario?: {
    id: number;
    email: string;
    nome?: string;
  };
}

// LanceRequest alinhado ao backend
export interface LanceRequest {
  valor: number; // BigDecimal (positivo)
  loteId: number; // Long (positivo)
  usuarioId: number; // Long (positivo)
  id?: number; // Adicionado para updates
}

// LanceFormData para o formulário
export interface LanceFormData {
  valor: string;
  loteId: string;
  usuarioId: string;
}
