// api/chatService.ts

import type { ChatRequest } from '../types/api';

interface StreamCallbacks {
  onChunk: (chunk: any) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export const streamChatResponse = async (
  request: ChatRequest,
  token: string,
  callbacks: StreamCallbacks
) => {
  // --- BATCHING LOGIC ---
  // This is the core fix. Instead of calling the onChunk callback for every
  // single piece of data (which can overwhelm React), we collect all chunks
  // that arrive within a single animation frame and process them in one batch.
  let chunkQueue: any[] = [];
  let isProcessingScheduled = false;

  function processQueue() {
    if (chunkQueue.length === 0) {
      isProcessingScheduled = false;
      return;
    }
    
    // Process all chunks that are currently in the queue
    const chunksToProcess = [...chunkQueue];
    chunkQueue = []; // Clear the queue for the next batch
    
    // Call the onChunk callback ONCE with the entire batch
    callbacks.onChunk(chunksToProcess);
    
    // Schedule the next processing frame if more chunks have arrived
    isProcessingScheduled = false;
    if (chunkQueue.length > 0) {
      scheduleProcessing();
    }
  }

  function scheduleProcessing() {
    if (isProcessingScheduled) return;
    isProcessingScheduled = true;
    requestAnimationFrame(processQueue);
  }
  // --- END BATCHING LOGIC ---

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    if (!response.body) throw new Error("Response body is null");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === 'data: [DONE]') continue;
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          try {
            const parsed = JSON.parse(jsonStr);
            // Instead of calling the callback directly, add to the queue and schedule processing.
            chunkQueue.push(parsed);
            scheduleProcessing();
          } catch (e) {
            console.error("Failed to parse stream JSON:", jsonStr, e);
          }
        }
      }
    }
  } catch (error) {
    callbacks.onError(error as Error);
  } finally {
    // Ensure any remaining chunks in the queue are processed before closing.
    if (chunkQueue.length > 0) {
        processQueue();
    }
    callbacks.onClose();
  }
};