import { z } from 'zod';

// ─── Forgot User ID schema ────────────────────────────────────────────────────
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

// ─── Forgot Password schema (Step 1: Client ID + PAN) ────────────────────────
export const forgotPasswordSchema = z.object({
  username: z
    .string()
    .nonempty('Client ID is required'),
  pan: z
    .string()
    .nonempty('PAN is required')
    .length(10, 'PAN must be exactly 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)'),
});

export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

// ─── Set Password schema (Step 3: new password + confirm) ────────────────────
export const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .nonempty('Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SetPasswordInputs = z.infer<typeof setPasswordSchema>;