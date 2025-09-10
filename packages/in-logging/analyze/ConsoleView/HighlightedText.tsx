/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

export function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <span>{text}</span>;

  const regex = new RegExp(keyword, 'gi');
  const matches = [...text.matchAll(regex)];

  if (matches.length === 0) return <span>{text}</span>;

  const parts = text.split(regex);
  let currentIndex = 0;

  return (
    <span>
      {parts.map((part, i) => {
        if (i < parts.length - 1) {
          const match = matches[i];
          const originalKeyword = text.slice(currentIndex + part.length, currentIndex + part.length + match[0].length);
          currentIndex += part.length + match[0].length;
          return (
            <>
              {part}
              <span style={{ backgroundColor: 'yellow' }}>{originalKeyword}</span>
            </>
          );
        }
        return part;
      })}
    </span>
  );
}
