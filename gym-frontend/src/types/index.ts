export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'ELITE_USER';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  capacity: number;
}

export interface AuthResponse {
  access_token: string;
}
