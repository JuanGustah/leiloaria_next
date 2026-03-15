// User Response - Alinhado com UserResponse do backend Java
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; // ISO 8601 format
  telefone: string[];
  ativo: boolean;
}

// User Request - Para criar/atualizar usuário
export interface UserRequest {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; // ISO 8601 format
  telefone: string[];
}

// Dados do formulário (frontend)
export interface UserFormData {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; // YYYY-MM-DD
  telefone: string[];
}

// User para autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface RegisterFormDTO {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
