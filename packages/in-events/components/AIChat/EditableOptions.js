/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { t } from 'in-i18n';

import locals from './EditableOptions.mless';

export default function EditableOptions({ messageItem, instance }) {
  const [selected, setSelected] = useState(null);
  const options = messageItem?.user_defined?.options;
  const buttonStyle =
    'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';
  const moreOptions = messageItem?.user_defined?.[selected?.key];
  return (
    <div className={`${locals.editable} WAC__button-holder`}>
      <ul>
        {options.map(i => (
          <li key={i.key}>
            <button
              disabled={selected?.key === i.key}
              onClick={() => {
                setSelected(i);
              }}
              className={classNames(buttonStyle, { 'cds--chat-btn--quick-action--selected': selected?.key === i.key })}
            >
              {i.value}
            </button>
          </li>
        ))}
      </ul>
      {moreOptions && (
        <div>
          <div className={locals.morePrompt}>{t('in-events:aichat.whatToKnow', { category: selected?.value })}</div>
          <ul>
            {moreOptions.map(i => (
              <li key={i.key}>
                <button
                  onClick={() => {
                    const textField = instance?.elements?.getMessageInput?.();
                    if (textField) {
                      textField.setValue(i.value);
                      textField.getHTMLElement?.()?.focus();
                    }
                  }}
                  className={buttonStyle}
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
