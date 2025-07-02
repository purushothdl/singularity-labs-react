import { useState } from 'react';
import { FiUser, FiClock } from 'react-icons/fi';
import type { UserPublic } from '../../types/api';
import { useClickOutside } from '../../hooks/useClickOutside';
import { capitalizeFirstLetter } from '../../utils/stringFormatters';

type ProfileDropdownProps = {
  user: UserPublic;
};

export const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(prev => !prev)} 
        className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white hover:bg-[#166FE5] transition-all transform hover:scale-105"
      >
        <FiUser className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-72 bg-[#111516] border border-gray-700 rounded-lg shadow-xl z-20 origin-top-right transition-all duration-200 ease-out transform opacity-100 scale-100">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-lg">
                <FiUser className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">{capitalizeFirstLetter(user.username)}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <FiClock className="w-5 h-5 mr-3 text-indigo-400" />
              <div>
                <p className="text-xs text-gray-400">Timezone</p>
                {user.timezone ? (
                  <p className="text-sm font-medium text-white">{user.timezone}</p>
                ) : (
                  <p className="text-sm font-medium text-yellow-400">Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};