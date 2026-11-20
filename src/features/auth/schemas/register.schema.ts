import { z } from 'zod';

/** Must match backend: backend/src/modules/auth/auth.validation.ts (registerSchema.body). */
export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is too short').max(150),
    age: z.coerce
      .number({ message: 'Required' })
      .int('Invalid age')
      .positive('Invalid age')
      .max(130, 'Invalid age'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Required' }),

    phone: z
      .string()
      .min(6, 'Enter a valid phone number')
      .max(20)
      .regex(/^[0-9+\-\s()]+$/, 'Only digits and + - ( ) allowed'),
    email: z.email({ message: 'Enter a valid email' }).max(191),

    address: z.string().min(2, 'Required').max(255),
    city: z.string().min(2, 'Required').max(80),
    state: z.string().min(2, 'Required').max(80),
    pincode: z.string().regex(/^\d{3,12}$/, 'Enter a valid pincode'),
    location: z.string().min(2, 'Required').max(120),

    maritalStatus: z.enum(['single', 'married', 'other']).optional(),
    education: z.string().max(120).optional(),
    occupation: z.string().max(120).optional(),
    referredBy: z.string().max(120).optional(),

    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    confirmPassword: z.string().min(1, 'Please re-enter your password'),

    consent: z.literal(true, { message: 'You must confirm to continue' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormValues = z.output<typeof registerSchema>;
