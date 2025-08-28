export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCreateDTO {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  active?: boolean;
  password: string;
}

export interface EmployeeUpdateDTO {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  active?: boolean;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}