export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
}

export interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export interface User {
  username: string;
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}
