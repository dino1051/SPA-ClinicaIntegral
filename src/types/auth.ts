export type Role = "ADMIN" | "DOCTOR" | "RECEPCION";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UsuarioLogin {
  id: number;
  nombre: string | null;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioLogin;
}
