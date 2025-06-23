/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  ChatInstance,
  CustomSendMessageOptions,
  MessageRequest,
  MessageResponseTypes,
  TextItem,
  UserDefinedItem
} from '@instana/ai-chat';

import { IsLoadingCounterType, UserDefinedType } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { promptSlots } from 'in-custom-dashboards/api';
import { hasError } from 'in-services/util/result';

const RESTRICTION_TEXT: string =
  'Sorry, I can only handle widget creation on custom dashboards. Please use a more specific prompt.';

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

  const userQuery = request.input.text;
  if (userQuery) {
    instance.updateIsLoadingCounter(IsLoadingCounterType.INCREASE);
    promptSlots(userQuery).subscribe(
      result => {
        if (hasError(result)) {
          instance.updateIsLoadingCounter(IsLoadingCounterType.DECREASE);
          sendError(`Something went wrong. ${result.errors[0].message}`);
        }

        if (result.data) {
          instance.updateIsLoadingCounter(IsLoadingCounterType.DECREASE);
          const { inferredSlotConfig, possibleSlotConfig } = result.data;

          // if widget type could not be inferred, we can assume that user didn't prompt anything meaningful
          if (inferredSlotConfig?.widgetType == null) {
            instance.messaging.addMessage({
              id: crypto.randomUUID(),
              output: {
                generic: [{ response_type: MessageResponseTypes.TEXT, text: RESTRICTION_TEXT } as TextItem]
              }
            });
            return;
          }

          instance.messaging.addMessage({
            id: crypto.randomUUID(),
            output: {
              generic: [
                {
                  response_type: MessageResponseTypes.USER_DEFINED,
                  user_defined: { user_defined_type: UserDefinedType.SLOTS, inferredSlotConfig, possibleSlotConfig }
                } as UserDefinedItem
              ]
            }
          });
        }
      },
      // On Error
      error => {
        instance.updateIsLoadingCounter(IsLoadingCounterType.DECREASE);
        const msg = error.toString ? error.toString() : JSON.stringify(error);
        sendError(msg);
      }
    );
  }
}

export { customSendMessage };
