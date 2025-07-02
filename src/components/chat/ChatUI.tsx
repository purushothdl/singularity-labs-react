// // components/chat/ChatUI.tsx

// import { useRef, useEffect, useState } from 'react';
// import { FiSend, FiCheck, FiCpu } from 'react-icons/fi';
// import type { ChatMessage, AIMessage } from '../../types/app';
// import { useAuth } from '../../context/AuthContext';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// // --- Loading Spinner for Agent Process ---
// const Spinner = () => (
//     <div className="w-4 h-4 shrink-0 mt-0.5">
//         <div className="w-full h-full border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//     </div>
// );

// // --- Agent Process Details Component ---
// const AgentProcess = ({ msg }: { msg: AIMessage }) => (
//     <div className="mt-4 pt-3 border-t border-white/10">
//         <details>
//             <summary className="text-xs text-gray-400 cursor-pointer flex items-center gap-2 hover:text-gray-200 transition-colors">
//                 <FiCpu /> Agent Process
//             </summary>
//             <div className="mt-3 pl-2 space-y-2 border-l border-gray-600">
//                 {msg.run_details?.map((step, i) => (
//                     <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
//                         {step.status === 'complete' 
//                             ? <FiCheck className="text-green-400 mt-0.5 shrink-0" size={16}/> 
//                             : <Spinner />
//                         }
//                         <span dangerouslySetInnerHTML={{ __html: step.name }} />
//                     </div>
//                 ))}
//             </div>
//         </details>
//     </div>
// );

// // --- Message Component ---
// const Message = ({ msg }: { msg: ChatMessage }) => {
//     // Note: `useAuth` and `getInitials` are no longer needed here if user info is passed down,
//     // but we'll leave them for now. You were right about unused vars.
//     const { user } = useAuth();
//     const isAI = msg.type === 'ai';
//     const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//     return (
//         // FIX: Reversing the row for the user's message is a cleaner way to right-align it
//         <div className={`flex items-start gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
//             {/* FIX: Agent avatar no longer has a white background. It now has a subtle, branded glow. */}
//             <div className="w-20 h-20 flex items-center justify-center shrink-0 bg-slate-800 rounded-full ring-1 ring-white/10">
//                 {isAI ? (
//                     <img src="src/assets/icons/agent.png" alt="agent" className="w-36 h-14"/>
//                 ) : (
//                     <div className="text-base font-semibold text-white">
//                         {getInitials(user?.username || 'U')}
//                     </div>
//                 )}
//             </div>
            
//             <div className="flex flex-col max-w-lg">
//                 {/* FIX: Corrected text color, padding, and border radius for a cleaner bubble look */}
//                 <div className={`px-4 py-2.5 rounded-2xl ${isAI 
//                     ? 'bg-slate-700 text-slate-200 rounded-tl-none' 
//                     : 'bg-blue-600 text-white rounded-br-none'}`
//                 }>
//                     {/* `prose-p:my-0` ensures tight spacing for simple text messages */}
//                     <div className="prose prose-sm prose-invert max-w-none prose-p:my-0">
//                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                             {/* Show a blinking cursor while waiting for the first token */}
//                             {msg.content || '<span class="animate-pulse">▍</span>'}
//                         </ReactMarkdown>
//                     </div>
//                     {isAI && msg.run_details && msg.run_details.length > 0 && <AgentProcess msg={msg} />}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- ChatWindow Component ---
// export const ChatWindow = ({ messages }: { messages: ChatMessage[] }) => {
//     const scrollRef = useRef<HTMLDivElement>(null);
//     useEffect(() => {
//         // Scroll to the bottom whenever messages change
//         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         // FIX: The layout is now a flex column that grows to fill available space and scrolls
//         <div className="flex-1 overflow-y-auto p-6">
//             <div className="max-w-4xl mx-auto w-full space-y-6">
//                 {messages.map((msg, i) => <Message key={i} msg={msg} />)}
//                 {/* This empty div is the target for our auto-scrolling */}
//                 <div ref={scrollRef} />
//             </div>
//         </div>
//     );
// };

// // --- MessageInput Component ---
// interface MessageInputProps {
//   onSend: (input: string) => void;
//   isLoading: boolean;
// }
// export const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
//     const [input, setInput] = useState('');
//     const textAreaRef = useRef<HTMLTextAreaElement>(null);

//     const handleSend = () => {
//         if (input.trim()) {
//             onSend(input);
//             setInput('');
//         }
//     };

//     // Auto-resize the textarea height based on content
//     useEffect(() => {
//         if (textAreaRef.current) {
//             textAreaRef.current.style.height = 'auto';
//             const scrollHeight = textAreaRef.current.scrollHeight;
//             textAreaRef.current.style.height = `${scrollHeight}px`;
//         }
//     }, [input]);

//     return (
//         // FIX: A cleaner, more integrated input area design
//         <div className="p-4 bg-slate-900/70 backdrop-blur-sm border-t border-white/10">
//             <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl p-2 flex items-end gap-2 border border-slate-600 focus-within:border-blue-500 transition-colors">
//                 <textarea
//                     ref={textAreaRef}
//                     rows={1}
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => {
//                         if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
//                             e.preventDefault();
//                             handleSend();
//                         }
//                     }}
//                     placeholder="Schedule a meeting..."
//                     className="w-full bg-transparent focus:outline-none text-white placeholder-slate-400 resize-none max-h-40 px-2 py-1.5"
//                     disabled={isLoading}
//                 />
//                 <button 
//                     onClick={handleSend} 
//                     disabled={isLoading || !input.trim()} 
//                     className="p-2.5 bg-blue-600 text-white rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors shrink-0"
//                 >
//                     {isLoading 
//                         ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
//                         : <FiSend size={20}/>
//                     }
//                 </button>
//             </div>
//         </div>
//     )
// }