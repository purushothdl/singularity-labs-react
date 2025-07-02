// components/chat/ChatInput.tsx
import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
    onSend: (input: string) => void;
    isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <div className="p-4">
            <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl p-2 flex items-end gap-2 border border-slate-600 focus-within:border-[#00d4ff]">
                <textarea
                    ref={textAreaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Schedule a meeting..."
                    className="w-full bg-transparent focus:outline-none text-white placeholder-slate-500 resize-none max-h-40 px-2 py-1.5"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()} 
                    className="p-2.5 bg-[#005AE0] text-white rounded-lg disabled:bg-slate-600 hover:bg-blue-500 shrink-0"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <FiSend size={20}/>}
                </button>
            </div>
        </div>
    );
};