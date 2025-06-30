/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/carbon';

import { AI_CHAT_TAG_NAME } from 'in-events/components/AIChat/utils';
import { useLocalStorage, trySet } from 'in-services/localStorage';
import { t } from 'in-i18n';

import locals from './InstructionPop.mless';

interface InsturctionPopProps {
  setPopOpen: Function;
}

const InstructionPop = ({ setPopOpen }: InsturctionPopProps) => {
  const promptKey = 'aichat-promptAcknowledge';
  const [acknowledge] = useLocalStorage(promptKey, false);
  // In order to position our instructions correctly we will use the
  // cds-aichat-react -> WACWidget as reference for positioning
  const anchor = document.getElementsByTagName(AI_CHAT_TAG_NAME);
  // Show nothing if this as previously been acknowledged or anchor doesn't exist
  if (acknowledge || anchor.length !== 1) {
    return <div />;
  }
  const positionDeterminant = anchor[0].shadowRoot.getElementById('WACWidget');
  const positions = positionDeterminant?.getBoundingClientRect();
  // Based off the positioning of the 'WACWidget' we will position our instructions
  const adjustedTop = (positions && `${positions.top + positions.height - 150}px`) || '0px';
  const adjustedLeft = (positions && `${positions.left - 315}px`) || '0px';

  return (
    <div
      id="PromptingInstruction"
      className={locals.instructionContainer}
      style={{ top: adjustedTop, left: adjustedLeft }}
    >
      <div className={locals.heading}>{t('in-events:aichat.prompting')}</div>
      <div className={locals.body}>
        {t('in-events:aichat.editSample')}
        <Button
          onClick={() => {
            trySet(promptKey, 'true');
            setPopOpen(false);
          }}
          size="sm"
          className={locals.button}
        >
          {t('in-events:aichat.gotIt')}
        </Button>
      </div>
      <div className={locals.caret} />
    </div>
  );
};

export default InstructionPop;
