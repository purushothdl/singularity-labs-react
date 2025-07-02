// src/types/app.ts

export interface RunStep {
  status: 'running' | 'complete';
  rawName: string;       // e.g., 'list_events'
  displayName: string;   // e.g., 'Calling tool: `list_events`'
}

// Ensure your message types use the updated RunStep
export interface AIMessage {
  type: 'ai';
  content: string;
  run_details?: RunStep[];
}

export interface HumanMessage {
  type: 'human';
  content: string;
}

export type ChatMessage = AIMessage | HumanMessage;