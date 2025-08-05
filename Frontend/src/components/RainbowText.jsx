import React from 'react';

const RainbowText = ({ children, className = '' }) => {
  const text = typeof children === 'string' ? children : '';
  
  return (
    <span className={`rainbow-letters ${className}`}>
      {text.split('').map((letter, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

export default RainbowText; 