import { z } from 'zod';

export const forgotSchema = z.object({
  pan: z
    .string()
    .nonempty('PAN is required')
    .length(10, 'PAN must be exactly 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)'),
  email: z
    .string()
    .nonempty('Email is required')
    .email('Invalid email address'),
});

export type ForgotInputs = z.infer<typeof forgotSchema>;