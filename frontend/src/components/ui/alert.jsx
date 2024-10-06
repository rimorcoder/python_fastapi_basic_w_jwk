// src/components/ui/alert.jsx

import React from 'react';

export const Alert = ({ children, className = '', ...props }) => {
  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div className={`mt-2 text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};