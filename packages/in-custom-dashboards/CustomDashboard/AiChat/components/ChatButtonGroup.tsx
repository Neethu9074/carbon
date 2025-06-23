/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { ChatButtonOption } from 'in-custom-dashboards/CustomDashboard/AiChat/types';

import locals from './ChatButtonGroup.mless';

interface ChatButtonGroupProps {
  options: ChatButtonOption[];
  onClick: (option: ChatButtonOption) => void;
}

const buttonStyle =
  'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';

export const ChatButtonGroup = ({ options, onClick }: ChatButtonGroupProps) => {
  const [selectedOption, setSelectedOption] = useState<ChatButtonOption | undefined>(undefined);

  return (
    <div className={`${locals.editable} WAC__button-holder`}>
      <ul>
        {options.map(i => (
          <li key={i.key}>
            <button
              disabled={selectedOption?.key === i.key}
              onClick={() => {
                setSelectedOption(i);
                onClick(i);
              }}
              className={classNames(buttonStyle, {
                'cds--chat-btn--quick-action--selected': selectedOption?.key === i.key
              })}
            >
              {i.value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
