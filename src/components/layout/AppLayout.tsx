// src/components/layout/AppLayout.tsx

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { ProfileDropdown } from '../common/ProfileDropdown';

type AppLayoutProps = {
  children: React.ReactNode;
  onClearChat: () => void;
  onUpdateProfile: () => void;
  onLogout: () => void;
};

export const AppLayout = ({ children, ...sidebarProps }: AppLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user } = useAuth();
  
  const toggleSidebar = () => setIsExpanded(prev => !prev);
    
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} {...sidebarProps} />
  
      {isExpanded && <div onClick={toggleSidebar} className="absolute inset-0 bg-black/60 z-[5] md:hidden" aria-hidden="true"></div>}
  
      {/* 
        THE FIX IS HERE:
        1. We make `<main>` a flex container that arranges its children vertically.
        2. We remove its internal scrollbar, as the ChatPage will now manage its own scroll.
      */}
      <main className={`h-screen transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'md:pl-64' : 'pl-0 md:pl-20'}`}>
        
        <header className="sticky top-0 h-16 flex items-center justify-end px-6 bg-gray-900/80 backdrop-blur-sm z-10 shrink-0">
          {user && <ProfileDropdown user={user} />}
        </header>

        {/* 
          THE FIX IS HERE:
          1. We remove the `p-6`. Your ChatPage will now control its own padding and background.
          2. We add `flex-1` to make this div take up ALL remaining vertical space after the header.
          3. `overflow-y-hidden` prevents this container from creating a scrollbar, forcing the ChatPage to handle it.
        */}
        <div className="flex-1 overflow-y-hidden">
          {children}
        </div>

      </main>
    </div>
  );
};