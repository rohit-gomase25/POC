import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type OtpInputs = z.infer<typeof otpSchema>;