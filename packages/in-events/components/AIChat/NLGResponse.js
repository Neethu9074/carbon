/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { t } from 'in-i18n';

import locals from './NLGResponse.mless';

const NLGResponse = ({ messageItem }) => {
  const text = messageItem?.user_defined?.text || '';
  const [show, setShow] = useState(false);

  // If show is true, show ALL text, otherwise just first 200 + ellipsis
  const textToDisplay = (show && text) || `${text.substring(0, 250)}...`;

  return (
    <div>
      {textToDisplay}
      <div onClick={() => setShow(!show)} className={locals.showHidButton}>
        {(show && t('in-events:aichat.showLess')) || t('in-events:aichat.showMore')}
      </div>
    </div>
  );
};

export default NLGResponse;
