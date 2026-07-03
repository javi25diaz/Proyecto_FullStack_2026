export interface AuthResponse {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}
