/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GenericItem, ChatInstance, BusEventType } from '@carbon/ai-chat';
import React, { useState } from 'react';
import classNames from 'classnames';

import { handleTracking } from 'in-events/components/AIChat/utils/utils';

import locals from './OptionsResponse.mless';

// Define the Option type
export type Option = {
  text: string; // Option display text
  sendText?: string; // Text to send to the chat instance
  tracking?: string; // Adjust this based on actual use
  onClick?: () => void; // option on click handler
  disableSend?: boolean; // If you do not want to send a response to the instance
};

// Define a custom user_defined type that includes options
export interface OptionsUserDefined {
  options: Option[];
}

// Use the generic parameter of GenericItem to specify the shape of user_defined
interface EditableOptionsProps {
  messageItem: GenericItem<OptionsUserDefined>;
  instance: ChatInstance;
}

export default function EditableOptions({ messageItem, instance }: EditableOptionsProps) {
  const [disable, setDisable] = useState(false);
  const options = messageItem?.user_defined?.options;
  const buttonStyle =
    'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';

  // Subscribe to anything being sent
  // Once something is sent we want to disable the buttons
  // Then unsubscribe and disable ALL options
  instance.on({
    type: BusEventType.SEND,
    handler: () => {
      instance.off({
        type: BusEventType.SEND,
        handler: () => {
          setDisable(true);
        }
      });
    }
  });

  return (
    <div className={`${locals.editable} WAC__button-holder`}>
      <ul>
        {options?.map((i: Option, index: number) => {
          const optionOnClick = i.onClick;
          const optionText = i.text;
          const optionSendText = i.sendText;
          const optionTracking = i.tracking;
          const optionsDisableSend = i.disableSend;
          return (
            <li key={index}>
              <button
                disabled={disable}
                onClick={() => {
                  optionOnClick && optionOnClick();
                  optionTracking && handleTracking(optionTracking);
                  !optionsDisableSend && instance.send(optionSendText || optionText);
                }}
                className={classNames(buttonStyle)}
              >
                {optionText}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
