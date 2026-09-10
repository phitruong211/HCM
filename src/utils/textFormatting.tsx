import React from 'react';

export const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split('→');
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className="arrow-accent">→</span>}
    </React.Fragment>
  ));
};
