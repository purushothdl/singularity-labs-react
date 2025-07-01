import type { ChatMessage } from "./app";

// POST /auth/register
export interface UserCreate {
    email: string;
    username: string;
    password: string;
  }
  
  // POST /auth/login (response)
  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }
  
  // GET /auth/me (response) & PUT /users/me (response)
  export interface UserPublic {
    id: string; // PyObjectId is a string on the frontend
    email: string;
    username: string;
    timezone: string | null; // Use `null` for optional fields
  }
  
  // PUT /users/me (request body)
  export interface UserUpdate {
    username?: string; // `?` denotes an optional property
    timezone?: string;
  }
  
  // POST /chat/stream (request body)
  export interface ChatRequest {
    input: string;
    history: ChatMessage[]; // We'll define ChatMessage in app.ts
  }