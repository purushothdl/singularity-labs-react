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

    useEffect(() => {
        if (!isLoading && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [isLoading]);

    return (
        <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl p-1 flex items-end gap-2 border border-slate-600 focus-within:border-[#00d4ff] transition-all duration-300 ease-in-out">
                <textarea
                    ref={textAreaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        // This check correctly prevents sending a new message while loading
                        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Schedule a meeting..."
                    className="w-full bg-transparent focus:outline-none text-white placeholder-slate-500 resize-none max-h-40 px-2 py-1.5 transition-all duration-200 ease-in-out"
                    // **THE FIX IS HERE:** The `disabled` prop has been completely removed.
                    // The textarea will now always be active.
                />
                <button 
                    onClick={handleSend} 
                    // This logic remains the same. The button is disabled when loading OR when the input is empty.
                    disabled={isLoading || !input.trim()} 
                    className="p-2.5 bg-[#005AE0] text-white rounded-lg disabled:bg-slate-600 hover:bg-blue-500 shrink-0 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <FiSend size={20} className="transform transition-transform duration-200 hover:scale-110"/>}
                </button>
            </div>
        </div>
    );
};