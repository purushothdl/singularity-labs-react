// src/components/layout/Sidebar.tsx
import {
  FiLogOut,
  FiTrash2,
  FiUser,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

type SidebarProps = {
  isExpanded: boolean;
  toggleSidebar: () => void;
  onClearChat: () => void;
  onUpdateProfile: () => void;
  onLogout: () => void;
};

export const Sidebar = ({
  isExpanded,
  toggleSidebar,
  onClearChat,
  onUpdateProfile,
  onLogout,
}: SidebarProps) => {
  const [showText, setShowText] = useState(isExpanded);

  useEffect(() => {
    let timeout: number | undefined;
    if (isExpanded) {
      timeout = setTimeout(() => setShowText(true), 200);
    } else {
      setShowText(false);
    }
    return () => { if (timeout) clearTimeout(timeout); };
  }, [isExpanded]);

  return (
    <>
      {/* Main container - ensure proper z-index and positioning */}
      <div
        className={`absolute top-0 left-0 flex flex-col h-screen bg-gradient-to-br from-slate-700 to-slate-900 text-white transition-all duration-300 ease-in-out rounded-r-2xl border-r border-slate-700 ${
          isExpanded ? 'w-64 p-4 z-30' : 'w-0 p-0 overflow-hidden md:w-20 md:p-4 md:overflow-visible z-10'
        }`}
      >
        {/* Content wrapper */}
        <div
          className={`h-full flex flex-col w-full transition-opacity duration-200 ${
            isExpanded 
              ? showText ? 'opacity-100' : 'opacity-0'
              : 'opacity-0 md:opacity-100'
          }`}
        >
          {/* Logo and title section */}
          <div className={`flex items-center mb-8 ${!isExpanded ? 'md:justify-center' : ''}`}>
            {isExpanded ? (
              <>
                <img
                  src="/assets/icons/sl_logo.webp"
                  alt="Singularity Labs Logo"
                  className="w-10 h-10 rounded-full shrink-0"
                />
                {showText && (
                  <div className="ml-3 min-w-0 flex-1">
                    <h1 className="text-xl font-bold text-gray-200 whitespace-nowrap">Singularity Labs</h1>
                    <p className="text-xs text-gray-400 whitespace-nowrap">Client Portal</p>
                  </div>
                )}
              </>
            ) : (
              <img
                src="/assets/icons/sl_logo.webp"
                alt="Singularity Labs Logo"
                className="w-10 h-10 rounded-full shrink-0 hidden md:block"
              />
            )}
          </div>

          {/* Navigation buttons */}
          <nav className="flex flex-col space-y-2">
            <button
              onClick={onClearChat}
              className={`flex items-center px-4 py-2 text-gray-200 rounded-md hover:bg-[#005AE0] hover:text-white transition-colors ${
                !isExpanded ? 'md:justify-center' : ''
              }`}
            >
              <FiTrash2 className="w-5 h-5 shrink-0" />
              {isExpanded && showText && <span className="ml-3 whitespace-nowrap">Clear Chat</span>}
            </button>
            <button
              onClick={onUpdateProfile}
              className={`flex items-center px-4 py-2 text-gray-200 rounded-md hover:bg-[#005AE0] hover:text-white transition-colors ${
                !isExpanded ? 'md:justify-center' : ''
              }`}
            >
              <FiUser className="w-5 h-5 shrink-0" />
              {isExpanded && showText && <span className="ml-3 whitespace-nowrap">Update Profile</span>}
            </button>
          </nav>

          {/* Logout button */}
          <div className="mt-auto">
            <button
              onClick={onLogout}
              className={`flex items-center w-full px-4 py-2 text-gray-200 rounded-md hover:bg-[#E34234] hover:text-white transition-colors ${
                !isExpanded ? 'md:justify-center' : ''
              }`}
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              {isExpanded && showText && <span className="ml-3 whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle button - higher z-index to stay above everything */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-9 p-1.5 bg-[#005AE0] rounded-full text-white hover:bg-[#0047B3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#005AE0] transition-all duration-300 z-40 ${
          isExpanded ? 'left-[244px]' : 'left-4 md:left-[68px]'
        }`}
      >
        {isExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
      </button>
    </>
  );
};