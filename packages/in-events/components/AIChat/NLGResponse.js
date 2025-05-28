/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect } from 'react';

import { t } from 'in-i18n';

import locals from './NLGResponse.mless';

const MAX_TEXT = 250;

const NLGResponse = ({ messageItem }) => {
  const originalText = messageItem?.user_defined?.text || '';
  const [showMore, setShowMore] = useState(false);
  // showButton controls the show all button
  const [showButton, setShowButton] = useState(false);
  // The text we will be showing visually
  const [streamedText, setStreamedText] = useState('');
  // Current index for the positioning in the original text
  const [index, setIndex] = useState(0);

  // This useEffect is responsible for controlling the typewriter
  // text effect
  useEffect(() => {
    // Keep type writing until you reach max text
    if (index < originalText.length && index < MAX_TEXT) {
      const timer = setTimeout(() => {
        naturalRandomIncrease(setStreamedText, setIndex, originalText, index);
      }, 50);
      return () => clearTimeout(timer);
    } else if (index == MAX_TEXT && !showMore) {
      // Add the ellipsis once you reach 250
      setStreamedText(prevText => prevText + '...');
      setIndex(prevIndex => prevIndex + 1);
      setShowButton(true);
    } else if (showMore) {
      // When the show more is clicked we display ALL the text
      setStreamedText(originalText);
    } else if (!showMore) {
      // When the show less is clicked we display 250 + ...
      setStreamedText(`${originalText.substring(0, MAX_TEXT)}...`);
    }
  }, [streamedText, index, showMore, originalText]);

  return (
    <div>
      {streamedText}
      {showButton && (
        <div onClick={() => setShowMore(!showMore)} className={locals.showHidButton}>
          {(showMore && t('in-events:aichat.showLess')) || t('in-events:aichat.showMore')}
        </div>
      )}
    </div>
  );
};

// In order to make the type writer text look more "natural" and as if its loading.
// We will increase the intervals of the substrings we are adding to the stream of
// text by intervals between 1-10.
const naturalRandomIncrease = (setStreamedText, setIndex, originalText, index) => {
  // Generate random number we want to get a substring of
  const interval = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  // If we have not got to the MAX_TEXT yet, add the substring to the stream text
  if (index + interval <= MAX_TEXT) {
    setStreamedText(prevText => prevText + originalText.substring(index, interval + index));
    setIndex(prevIndex => prevIndex + interval);
  } else if (index + interval > MAX_TEXT) {
    // Once we reach the end, just finish out the substring to MAX_TEXT
    setStreamedText(prevText => prevText + originalText.substring(index, MAX_TEXT));
    setIndex(MAX_TEXT);
  }
};

export default NLGResponse;
