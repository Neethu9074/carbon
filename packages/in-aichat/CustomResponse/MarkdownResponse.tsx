/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect } from 'react';
import { GenericItem } from '@carbon/ai-chat';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import locals from './MarkdownResponse.mless';

interface MarkdownResponseProps {
  messageItem: GenericItem;
}

const MarkdownResponse = ({ messageItem }: MarkdownResponseProps) => {
  const originalText = (messageItem?.user_defined?.text || '') as string;
  const [streamedText, setStreamedText] = useState('');
  const [index, setIndex] = useState(0);

  // This useEffect is responsible for controlling the typewriter text effect
  useEffect(() => {
    // Keep type writing until you reach the end
    if (index < originalText.length) {
      const timer = setTimeout(() => {
        naturalRandomIncrease(setStreamedText, setIndex, originalText, index);
      }, 50);
      return () => clearTimeout(timer);
    }
    return;
  }, [streamedText, index, originalText]);

  // Markdown content
  const htmlContent = toHtml(streamedText, { breaks: true });

  return (
    <div className={locals.markdownContainer}>
      <DangerousHtmlPresenter html={htmlContent} />
    </div>
  );
};

// In order to make the type writer text look more "natural" and as if its loading.
// We will increase the intervals of the substrings we are adding to the stream of
// text by intervals between 5-35.
const naturalRandomIncrease = (
  setStreamedText: React.Dispatch<React.SetStateAction<string>>,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
  originalText: string,
  index: number
) => {
  // Generate random number we want to get a substring of
  const interval = Math.floor(Math.random() * (35 - 5 + 1)) + 5;
  setStreamedText((prevText: string) => prevText + originalText.substring(index, interval + index));
  setIndex((prevIndex: number) => prevIndex + interval);
};

export default MarkdownResponse;
