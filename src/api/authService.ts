import apiClient from '../lib/axios'; 
import type { UserCreate, TokenResponse, UserPublic, UserUpdate } from '../types/api';

/**
 * Sends a registration request to the backend.
 * @param data - The user's registration details (username, email, password).
 * @returns A promise that resolves to the token response (access_token and token_type).
 */
export const register = async (data: UserCreate): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/register', data);
  return response.data;
};


/**
 * Sends a login request to the backend.
 * FastAPI's OAuth2PasswordRequestForm expects form-data, not JSON.
 * We must format the request accordingly.
 * @param email - The user's email, which is passed as the 'username' field.
 * @param password - The user's password.
 * @returns A promise that resolves to an object containing the access token.
 */
export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const params = new URLSearchParams();
  params.append('username', email); // Your backend expects email in the 'username' field
  params.append('password', password);

  const response = await apiClient.post<TokenResponse>('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};


/**
 * Fetches the currently authenticated user's profile.
 * This requires a valid JWT token to be sent in the headers,
 * which our axios interceptor handles automatically.
 * @returns A promise that resolves to the user's public profile data.
 */
export const getMe = async (): Promise<UserPublic> => {
  const response = await apiClient.get<UserPublic>('/auth/me');
  return response.data;
};


/**
 * Updates the currently authenticated user's profile.
 * @param data - The user data to update (e.g., username, timezone).
 * @returns A promise that resolves to the updated user profile.
 */
export const updateUser = async (data: UserUpdate): Promise<UserPublic> => {
    const response = await apiClient.put<UserPublic>('/users/me', data);
    return response.data;
}