'use client';

import React, { useEffect, useRef } from 'react';
import TypingIndicator from './TypingIndicator';

export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Waiting for interview to start...</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            // Skip system messages
            if (message.role === 'system') return null;

            const isUser = message.role === 'user';
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="message-bubble message-assistant">
                <TypingIndicator />
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
