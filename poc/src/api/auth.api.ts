import instance from "./axios";

const STATIC_PUBLIC_KEY = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1Gd3dEUVlKS29aSWh2Y05BUUVCQlFBRFN3QXdTQUpCQUxmQUp0Uy9ZcjVWSCtNUTVUZmkvTG1zNUZldDNMM3g2SUNYMW9zME15RWpjUC9ldmFGdFYrZkJOTTBKRG5WQ3h3alZwRkNHaElybkt1S3d1Y2pUUndrQ0F3RUFBUT09DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=";

export const preAuthHandshake = async () => {
  try {
    const response = await instance.post('/v1/api/auth/pre-auth-handshake', {
      devicePublicKey: STATIC_PUBLIC_KEY
    });
    return response.data;
  } catch (error: any) {
    console.error("Handshake Error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  const body = { username, password };
  try {
    const response = await instance.post('/v1/api/auth/login', body);
    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const validateOtp = async (username: string, otpValue: string) => {
  const body = { username, otp: parseInt(otpValue, 10) };
  try {
    const response = await instance.post('/v2/api/auth/validate-otp', body);
    return response.data;
  } catch (error: any) {
    console.error("OTP Validation Error:", error.response?.data || error.message);
    throw error;
  }
};

// ─── Unblock User — Step 1: sends OTP to registered mobile/email ─────────────
export const unblockUser = async (username: string, panNumber: string) => {
  try {
    const response = await instance.post('/v1/api/auth/unblock-user', { panNumber, username });
    return response.data;
  } catch (error: any) {
    console.error("Unblock User Error:", error.response?.data || error.message);
    throw error;
  }
};

// ─── Authenticate OTP — Step 2: verifies OTP and unblocks the account ─────────
export const authenticateOtp = async (username: string, otp: number) => {
  try {
    const response = await instance.post('/v1/api/auth/authenticate-otp', {
      otp,
      username,
      isUserBlocked: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Authenticate OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

// ─── Forgot User ID ───────────────────────────────────────────────────────────
export const forgotUserId = async (panNumber: string, emailId: string) => {
  try {
    const response = await instance.post('/v1/api/auth/forgot-user-id', { panNumber, emailId });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// ─── Forgot Password Step 1: send OTP ────────────────────────────────────────
export const forgotPassword = async (username: string, panNumber: string) => {
  try {
    const response = await instance.post('/v1/api/auth/forgot-password', { panNumber, username });
    return response.data;
  } catch (error: any) {
    console.error("Forgot Password Error:", error.response?.data || error.message);
    throw error;
  }
};

// ─── Forgot Password Step 2: verify OTP ──────────────────────────────────────
export const forgotPasswordVerifyOtp = async (username: string, otp: number) => {
  try {
    const response = await instance.post('/v1/api/auth/authenticate-otp', {
      otp,
      username,
      isUserBlocked: false,
    });
    return response.data;
  } catch (error: any) {
    console.error("Forgot Password OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

// ─── Forgot Password Step 3: set new password ────────────────────────────────
export const setPassword = async (username: string, password: string) => {
  try {
    const response = await instance.post('/v1/api/auth/set-password', { username, password });
    return response.data;
  } catch (error: any) {
    console.error("Set Password Error:", error.response?.data || error.message);
    throw error;
  }
};