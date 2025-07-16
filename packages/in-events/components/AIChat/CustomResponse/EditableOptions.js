/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { EVENT_AI_CHAT_APPLICATION, EVENT_AI_CHAT_INFRASTRUCTURE } from 'in-services/tracking/tracking';
import { handleTracking } from 'in-events/components/AIChat/utils';
import { t } from 'in-i18n';

import locals from './EditableOptions.mless';

export default function EditableOptions({ messageItem, instance }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [disable, setDisable] = useState(false);
  const options = messageItem?.user_defined?.options;
  const buttonStyle =
    'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';
  const moreOptions = messageItem?.user_defined?.[selectedType?.key];

  // Subscribe to anything being sent
  // Once something is sent we want to disable the buttons
  // Then unsubscribe
  instance.on({
    type: 'send',
    handler: () => {
      setDisable(true);
      instance.off({ type: 'send' });
    }
  });

  return (
    <div className={`${locals.editable} WAC__button-holder`}>
      <ul>
        {options.map((i, index) => (
          <li key={i.key}>
            <button
              disabled={selectedType?.key === i.key || disable}
              onClick={() => {
                setSelectedType(i);
                // Application is the first index value and infrastructure is the second
                // This is temporary because we are moving from this over to prompt library
                // but until that happens this is good to have
                handleTracking((i == 0 && EVENT_AI_CHAT_APPLICATION) || EVENT_AI_CHAT_INFRASTRUCTURE);
              }}
              className={classNames(buttonStyle, {
                'cds--chat-btn--quick-action--selected': selectedType?.key === i.key
              })}
            >
              {i.value}
            </button>
          </li>
        ))}
      </ul>
      {moreOptions && (
        <div>
          <div className={locals.morePrompt}>{t('in-events:aichat.whatToKnow', { category: selectedType?.value })}</div>
          <ul>
            {moreOptions.map(i => (
              <li key={i.key}>
                <button
                  onClick={() => {
                    setSelectedOption(i);
                    const textField = instance?.elements?.getMessageInput?.();
                    if (textField) {
                      textField.setValue(i.value);
                      textField.getHTMLElement?.()?.focus();
                    }
                  }}
                  className={classNames(buttonStyle, {
                    'cds--chat-btn--quick-action--selected': selectedOption?.key === i.key
                  })}
                  disabled={disable}
                >
                  {i.key}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
