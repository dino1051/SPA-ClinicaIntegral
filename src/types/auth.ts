export type Role = "ADMIN" | "DOCTOR" | "RECEPCION";
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  role?: Role;
}

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
}
