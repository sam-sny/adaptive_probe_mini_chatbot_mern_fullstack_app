'use client';

import React, { useState } from 'react';

export const InputArea = ({ onSubmit, isDisabled = false, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() && !isDisabled && !isLoading) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your response here..."
        disabled={isDisabled || isLoading}
        className={`input-field flex-1 resize-none h-20 ${isDisabled || isLoading ? 'disabled' : ''}`}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={isDisabled || isLoading || !message.trim()}
        className={`btn-primary h-20 ${isDisabled || isLoading || !message.trim() ? 'disabled' : ''}`}
      >
        {isLoading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  );
};

export default InputArea;
