/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect } from 'react';

import { t } from 'in-i18n';

import locals from './NLGResponse.mless';

const NLGResponse = ({ messageItem }) => {
  const text = messageItem?.user_defined?.text || '';
  // const [show, setShow] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [index, setIndex] = useState(0)
  // const [isPaused, setIsPaused] = useState(false)
  // let index = 0
  // let isPaused = false;
  // let stream  = false;

  // If show is true, show ALL text, otherwise just first 200 + ellipsis
  // const textToDisplay = (show && text) || `${text.substring(0, 250)}...`;

  useEffect(() => {
      console.log('useEffect', streamedText, text)
      if(streamedText != text) {
        console.log('inside')
        streamText();
      }
    }, [streamedText]);

  function streamText() {
    if (index < text.length) {
      setStreamedText(`${streamedText+text.charAt(index)}`)
      setIndex(index + 1)
      // Introduce pauses using specific characters or conditions
      if (text.charAt(index - 1) === '.') {
        // setIsPaused(true);
        setTimeout(() => {
          // setIsPaused(false);
          streamText();
        }, 500); // Pause for 500ms after a period or newline
      } else {
        setTimeout(streamText, 1000); // Continue typing
      }
    }
  }

  return (
    <div>
      {streamedText}
      {/* {textToDisplay}
      <div onClick={() => setShow(!show)} className={locals.showHidButton}>
        {!stream && ((show && t('in-events:aichat.showLess')) || t('in-events:aichat.showMore'))}
      </div> */}
    </div>
  );
};

export default NLGResponse;
