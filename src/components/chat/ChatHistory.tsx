// components/chat/ChatHistory.tsx
import { useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/app';
import { Message } from './Message';

export const ChatHistory = ({ messages }: { messages: ChatMessage[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Always scroll to the bottom when a new message is added.
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-grow p-6 overflow-y-auto">
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                <div ref={scrollRef} />
            </div>
        </div>
    );
};