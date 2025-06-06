/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { uniqueId } from 'lodash';

import {
  ChatInstance,
  CustomSendMessageOptions,
  MessageRequest,
  MessageResponseTypes,
  TextItem,
  UserDefinedItem
} from '@instana/ai-chat';

import { promptSlots } from 'in-custom-dashboards/api';
import { hasError } from 'in-services/util/result';

export async function sleep(milliseconds: number) {
  await new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function customSendMessage(request: MessageRequest, _: CustomSendMessageOptions, instance: ChatInstance) {
  const sendError = (errorMessage: string) => {
    instance.messaging.addMessage({
      output: {
        generic: [
          {
            agent_message_type: 'inline_error',
            response_type: 'text',
            text: errorMessage
          } as TextItem
        ]
      }
    });
  };

  const loadingMessageId = uniqueId('nl2widget-load-');
  const sendLoading = () => {
    instance.messaging.addMessage({
      id: loadingMessageId,
      output: {
        // @ts-expect-error stream_loading is not typed
        generic: [{ response_type: 'stream_loading' }]
      }
    });
  };

  const userQuery = request.input.text;
  if (userQuery) {
    sendLoading();
    promptSlots(userQuery).subscribe(
      result => {
        if (hasError(result)) {
          instance.messaging.removeMessages([loadingMessageId]);
          sendError(`Something went wrong. ${result.errors[0].message}`);
        }

        if (result.data) {
          instance.messaging.removeMessages([loadingMessageId]);

          const { inferredSlotConfig, possibleSlotConfig } = result.data;
          instance.messaging.addMessage({
            id: crypto.randomUUID(),
            output: {
              generic: [
                {
                  response_type: MessageResponseTypes.USER_DEFINED,
                  user_defined: { inferredSlotConfig, possibleSlotConfig }
                } as UserDefinedItem
              ]
            }
          });
        }
      },
      // On Error
      error => {
        instance.messaging.removeMessages([loadingMessageId]);
        const msg = error.toString ? error.toString() : JSON.stringify(error);
        sendError(msg);
      }
    );
  }
}

export { customSendMessage };
