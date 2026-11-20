export type UserRole = 'patient' | 'admin' | 'doctor';

export interface PatientUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  isEmailVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: PatientUser;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  location?: string;
  maritalStatus?: 'single' | 'married' | 'other';
  education?: string;
  occupation?: string;
  referredBy?: string;
  consent: true;
}

export interface RegisterResponse {
  userId: string;
  email: string;
}
