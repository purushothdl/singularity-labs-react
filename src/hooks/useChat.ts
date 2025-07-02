// hooks/useChat.ts

import { useState } from 'react';
import type { ChatMessage, AIMessage } from '../types/app';
import { streamChatResponse } from '../api/chatService';
import { useAuth } from '../context/AuthContext';

export const useChat = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearChat = () => setMessages([]);

  const sendMessage = async (input: string) => {
    if (!input.trim() || !token) return;
    setIsLoading(true);

    const historyForAPI = [...messages];
    const newHumanMessage: ChatMessage = { type: 'human', content: input };
    
    setMessages(prev => [...prev, newHumanMessage, { type: 'ai', content: '', run_details: [] }]);

    let generatingAnswerStepAdded = false;

    await streamChatResponse(
      { input, history: historyForAPI },
      token,
      {
        // **THE FIX:** `chunks` is now an array of chunks, not a single one.
        onChunk: (chunks: any[]) => {
          setMessages(prev => {
            const allButLast = prev.slice(0, -1);
            let lastMessage = prev[prev.length - 1];

            if (lastMessage?.type !== 'ai') return prev;
            
            // Create a mutable copy to update within the loop
            const updatedLastMessage = { 
                ...lastMessage,
                run_details: lastMessage.run_details ? [...lastMessage.run_details] : []
            };

            // Process the entire batch of chunks
            chunks.forEach(chunk => {
              if (chunk.type === 'tool_start') {
                const lastStep = updatedLastMessage.run_details[updatedLastMessage.run_details.length - 1];
                if (lastStep?.status === 'running') lastStep.status = 'complete';

                // **THE CHANGE IS HERE**
                const toolDisplayName = `<span class="text-[#2df299] font-mono bg-green-900/50 px-1.5 py-0.5 rounded">${chunk.name}</span>`;
                updatedLastMessage.run_details.push({ 
                    status: 'running',
                    rawName: chunk.name, // Store the raw name
                    displayName: `Calling tool: ${toolDisplayName}` // Store the display HTML
                });
              } else if (chunk.type === 'token') {
                if (!generatingAnswerStepAdded) {
                  const lastStep = updatedLastMessage.run_details[updatedLastMessage.run_details.length - 1];
                  if (lastStep?.status === 'running') lastStep.status = 'complete';
                  
                  // **THE CHANGE IS HERE**
                  updatedLastMessage.run_details.push({
                      status: 'running',
                      rawName: 'generating_answer', // Give a raw name to this step too
                      displayName: 'Generating final answer'
                  });
                  generatingAnswerStepAdded = true;
                }
                updatedLastMessage.content += chunk.content;
              }
            });
            
            return [...allButLast, updatedLastMessage];
          });
        },
        onError: (error) => {
          console.error("Streaming error:", error);
          const errorMessage: AIMessage = { type: 'ai', content: `An error occurred: ${error.message}` };
          setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        },
        onClose: () => {
          setIsLoading(false);
          setMessages(prev => {
            const allButLast = prev.slice(0, -1);
            let lastMessage = prev[prev.length - 1];
            if (lastMessage?.type === 'ai' && lastMessage.run_details) {
                const updatedLastMessage = { ...lastMessage, run_details: [...lastMessage.run_details] };
                const lastStep = updatedLastMessage.run_details[updatedLastMessage.run_details.length - 1];
                if (lastStep?.status === 'running') lastStep.status = 'complete';
                return [...allButLast, updatedLastMessage];
            }
            return prev;
          });
        },
      }
    );
  };

  return { messages, isLoading, sendMessage, clearChat };
};