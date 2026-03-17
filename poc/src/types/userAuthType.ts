export interface User {
  firstName: string;
  lastName: string;
  username: string;
  userId: number;
  accountId: string;
  emailId: string;
  enabledExchanges: string[];
  enabledProductCode: string[];
  brokerName: string;
  userType: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: JwtTokens | null;
  bffPublicKey: string | null;
  isAuthenticated: boolean;
  setHandshake: (key: string) => void;
  setAuth: (user: User, tokens: JwtTokens) => void;
  logout: () => void;
}