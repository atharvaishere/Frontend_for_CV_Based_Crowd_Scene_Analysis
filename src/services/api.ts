// src/services/api.ts
const API_URL = "https://crownalysis.up.railway.app/";

export interface User {
  email: string;
  password: string;
}
export const mockAuth = {
  login: async (credentials: User): Promise<{ token: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'mock-jwt-token' }); // Always resolves successfully
      }, 1000); // 1 second delay to simulate network
    });
  }
};