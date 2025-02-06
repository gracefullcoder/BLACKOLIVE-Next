import React from 'react';

interface MessageBarProps {
  messages: string[];
}

const MessageBar: React.FC<MessageBarProps> = ({ messages }) => {
  return (
    <div className="relative overflow-hidden bg-black text-white h-10 flex items-center">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
      <div
        className={`flex w-full ${
          messages.length > 1
            ? 'justify-between animate-[scroll_10s_linear_infinite] whitespace-nowrap'
            : 'justify-center'
        }`}
      >
        {messages.map((message, index) => (
          <div key={index} className="mx-4 text-2xl font-bold tracking-wide">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageBar;