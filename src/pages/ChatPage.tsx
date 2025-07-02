// pages/ChatPage.tsx

import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { Welcome } from '../components/chat/Welcome';
import { useChat } from '../hooks/useChat';
import { ChatHistory } from '../components/chat/ChatHistory';
import { ChatInput } from '../components/chat/ChatInput';

export const ChatPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  const handleUpdateProfile = () => alert('Update Profile Clicked!');
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppLayout onClearChat={clearChat} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout}>
      <div className="flex flex-col h-full"> 
        
        {/* Main content area: either Welcome screen or Chat History */}
        <div className="flex-grow flex flex-col overflow-y-hidden">
            {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                    <Welcome onSuggestionClick={handleSuggestionClick} />
                </div>
            ) : (
                <ChatHistory messages={messages} />
            )}
        </div>
        
        {/* Input is now OUTSIDE the scrolling area, pinned to the bottom */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
};