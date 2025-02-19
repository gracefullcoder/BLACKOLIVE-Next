import React from 'react';
import { Megaphone } from "lucide-react";

interface MessageBarProps {
  messages: string[];
}

const MessageBar: React.FC<MessageBarProps> = ({ messages }) => {
  return (
    <div className="relative overflow-hidden bg-black text-white h-10 flex items-center">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }

          @media (max-width: 768px) {
            @keyframes scroll {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          }
        `}
      </style>
      <div className="relative px-1 h-full left-0 flex items-center gap-2 z-20 bg-black">
        <Megaphone className="w-6 text-green-400 animate-pulse" />
      </div>
      <div
        className="flex w-fit justify-between mx-auto whitespace-nowrap"
        style={{
          gap: `${100 / (messages.length || 1)}vw`,
          animation: `scroll ${messages.length == 1 ? 10 : messages.length * 4}s linear infinite`
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className="text-xl font-semibold tracking-wide">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageBar;