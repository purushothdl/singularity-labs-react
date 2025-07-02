// components/chat/Welcome.tsx

import React from 'react';
import { FiCalendar, FiUsers, FiClock, FiTool } from 'react-icons/fi';

interface WelcomeProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: <FiCalendar size={20} />,
    title: "View my schedule",
    text: "Show me my upcoming meetings for tomorrow",
  },
  {
    icon: <FiTool size={20} />,
    title: "Schedule a technical review",
    text: "Schedule a 45 minute technical review for tomorrow afternoon",
  },
  {
    icon: <FiUsers size={20} />,
    title: "Find team availability",
    text: "Is there a 30 minute slot available with the engineering team next week?",
  },
  {
    icon: <FiClock size={20} />,
    title: "Reschedule a meeting",
    text: "Can you reschedule my 1:1 with Andrew to next week?",
  },
];

export const Welcome = ({ onSuggestionClick }: WelcomeProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="text-center mb-12">
        <img src="src/assets/icons/agent.png" alt="Helion Agent" className="w-42 h-24 mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white">Helion Scheduling Concierge</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          I'm your AI-powered assistant for advanced collaboration scheduling.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(item.text)}
            className="group text-left p-4 bg-gray-800/50 hover:bg-gray-700/60 rounded-lg border border-gray-700 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gray-900 p-3 rounded-lg text-[#00d4ff] flex justify-center items-center">
                {/* Adjust icon size for small screens */}
                {React.cloneElement(item.icon, { size: window.innerWidth < 400 ? 16 : 20 })}
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 mt-2">
                  {item.text}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
