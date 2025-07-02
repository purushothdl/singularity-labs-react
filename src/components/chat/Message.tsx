// components/chat/Message.tsx
import type { ChatMessage, AIMessage } from '../../types/app';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCheck, FiCpu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { capitalizeFirstLetter } from '../../utils/stringFormatters';
import { toolStatusMessages, getDefaultStatusMessage } from '../../utils/toolStatusMessages';

// --- (Spinner, AgentProcess, and LoadingStatus components remain unchanged) ---
const Spinner = () => (
    <div className="w-4 h-4 shrink-0 mt-0.5">
        <div className="w-full h-full border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const AgentProcess = ({ msg }: { msg: AIMessage }) => (
    <div className="mt-4">
        <details className="bg-slate-800/50 border border-slate-700 rounded-lg">
            <summary className="px-3 py-2 text-xs text-slate-400 cursor-pointer flex items-center gap-2 hover:text-slate-200">
                <FiCpu /> Agent Process
            </summary>
            <div className="p-3 border-t border-slate-700 space-y-2">
                {msg.run_details?.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        {step.status === 'complete' 
                            ? <FiCheck className="text-green-400 mt-0.5 shrink-0" size={16}/> 
                            : <Spinner />}
                        <span dangerouslySetInnerHTML={{ __html: step.displayName }} />
                    </div>
                ))}
            </div>
        </details>
    </div>
);

const LoadingStatus = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 text-slate-400">
        <Spinner />
        <span>{text}</span>
    </div>
);

export const Message = ({ msg }: { msg: AIMessage | ChatMessage }) => {
    const { user } = useAuth();
    const isAI = msg.type === 'ai';

    const renderMainContent = () => {
        if (msg.content) {
            // **THE FIX IS HERE:** We add the `components` prop to `ReactMarkdown`.
            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // This function will be used to render every `<a>` tag.
                        a: (props) => {
                            // We spread all original props, then add our new ones.
                            return <a {...props} target="_blank" rel="noopener noreferrer" />;
                        }
                    }}
                >
                    {msg.content}
                </ReactMarkdown>
            );
        }
        if (isAI && msg.run_details && msg.run_details.length > 0) {
            const runningStep = [...msg.run_details].reverse().find(step => step.status === 'running');
            if (runningStep) {
                const statusText = toolStatusMessages[runningStep.rawName] || getDefaultStatusMessage();
                return <LoadingStatus text={statusText} />;
            }
        }
        return <LoadingStatus text="Orion is thinking..." />;
    };

    return (
        <div className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 ${isAI ? '' : 'sm:flex-row-reverse'}`}>
            {isAI ? (
                <div className="flex items-center gap-2 sm:block">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 rounded-full text-sm font-semibold text-white">
                        <img src="src/assets/icons/agent.png" alt="agent" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <p className="font-semibold text-white sm:hidden">Orion</p>
                </div>
            ) : null}
            <div className={`flex-1 pt-0.5 ${!isAI && 'flex flex-col items-end'}`}>
                <p className="hidden sm:block font-semibold text-white mb-1">
                    {isAI ? 'Orion' : capitalizeFirstLetter(user?.username || 'You')}
                </p>
                <div className={`prose prose-sm prose-invert max-w-2xl ${isAI ? 'text-slate-300' : 'bg-[#1877F2] rounded-lg px-4 py-2 text-white'} break-words`}>
                    {renderMainContent()}
                </div>
                {isAI && msg.run_details && msg.run_details.length > 0 && <AgentProcess msg={msg} />}
            </div>
        </div>
    );
};