import { z } from 'zod';
import { Gender } from './types';

export const employeeCreateSchema = z.object({
  fullName: z
    .string()
    .min(4, 'Full name must be at least 4 characters')
    .max(160, 'Full name must not exceed 160 characters')
    .nonempty('Full name is required'),
  email: z
    .string()
    .email('Email should be valid')
    .nonempty('Email is required'),
  dateOfBirth: z
    .string()
    .nonempty('Date of birth is required')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      return selected < today;
    }, 'Date of birth must be in the past'),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .nonempty('Phone number is required'),
  active: z.boolean().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nonempty('Password is required'),
});

export const employeeUpdateSchema = z.object({
  fullName: z
    .string()
    .min(4, 'Full name must be at least 4 characters')
    .max(160, 'Full name must not exceed 160 characters')
    .nonempty('Full name is required'),
  dateOfBirth: z
    .string()
    .nonempty('Date of birth is required')
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      return selected < today;
    }, 'Date of birth must be in the past'),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .nonempty('Phone number is required'),
  active: z.boolean().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
});

export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;