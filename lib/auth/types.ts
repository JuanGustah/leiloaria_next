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
