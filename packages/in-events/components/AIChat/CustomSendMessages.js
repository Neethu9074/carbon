/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { uniqueId } from 'lodash';

import {
  AIConsentPrompt,
  DefinedTreeQuestions,
  handleDefinedTreeQuestions,
  InitialLoadOptions,
  reprompt
} from 'in-events/components/AIChat/DefinedQuestions';
import { sendAPIQuery, fetchAPIData, formatForTable } from 'in-events/components/AIChat/chatAPI';
import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

// Params:
// request of type MessageRequest
// requestOptions of type CustomSendMessageOptions
// instance of type ChatInstance
export async function CustomSendMessages(
  request,
  // eslint-disable-next-line
  requestOptions,
  instance
) {
  if (automationActionAiGenerationUnitEnabled) {
    instance.updateAssistantInputFieldVisibility(true);
  } else {
    instance.updateAssistantInputFieldVisibility(false);
  }
  async function sendTextMessage(nlg, text, restart) {
    await instance.messaging.addMessage(
      {
        output: {
          generic: [
            ...(nlg
              ? [
                  {
                    response_type: 'user_defined',
                    user_defined: {
                      user_defined_type: 'nlg_response',
                      text: nlg
                    }
                  }
                ]
              : []),
            {
              response_type: 'text',
              text: text
            },
            ...(restart ? reprompt : [])
          ]
        }
      },
      { silent: false }
    );
  }
  async function sendError(nlg, errorMessage) {
    await instance.messaging.addMessage(
      {
        output: {
          generic: [
            ...(nlg
              ? [
                  {
                    response_type: 'user_defined',
                    user_defined: {
                      user_defined_type: 'nlg_response',
                      text: nlg
                    }
                  }
                ]
              : []),
            {
              agent_message_type: 'inline_error',
              response_type: 'text',
              text: errorMessage
            }
          ]
        }
      },
      { silent: false }
    );

    await setTimeout(
      () =>
        instance.messaging.addMessage(
          {
            output: {
              generic: reprompt
            }
          },
          { silent: false }
        ),
      500
    );
  }

  // If the input message is valid and not blank we will want to make an API call
  const userQuery = request.input.text;
  if (userQuery !== undefined && userQuery !== '' && !DefinedTreeQuestions.includes(userQuery)) {
    if (!automationActionAiGenerationUnitEnabled) {
      sendTextMessage(t('in-events:aichat.youMustAccept'), false);
      return;
    }

    const loadingMessageId = uniqueId('aichat_');
    instance.messaging.addMessage(
      {
        id: loadingMessageId,
        output: {
          generic: [
            {
              response_type: 'stream_loading'
            }
          ]
        }
      },
      { silent: false }
    );

    sendAPIQuery(userQuery).once(
      // On Success
      response => {
        instance.messaging.removeMessages([loadingMessageId]);
        const nlgResponse = response?.api?.NLG;
        if (!response) {
          sendError(nlgResponse, t('in-events:aichat.noData'));
          return;
        }
        if (response.error) {
          sendError(nlgResponse, response.error);
          return;
        }
        if (response.api?.error) {
          sendError(nlgResponse, response.api.error);
          return;
        }
        if (!response.api?.api_endpoint) {
          sendError(nlgResponse, t('in-events:aichat.unableToFindError'));
          return;
        }
        if (response.api?.api_endpoint === '/api/events') {
          sendError(nlgResponse, t('in-events:aichat.unableToFindError'));
          return;
        }
        const statusMessageId = uniqueId('aichat_');
        instance.messaging.addMessage(
          {
            id: statusMessageId,
            output: {
              generic: [
                {
                  response_type: 'user_defined',
                  user_defined: {
                    user_defined_type: 'nlg_response',
                    text: nlgResponse
                  }
                },
                {
                  response_type: 'text',
                  text: t('in-events:aichat.findingInfoFrom', { endpoint: response.api.api_endpoint })
                },
                {
                  response_type: 'stream_loading'
                }
              ]
            }
          },
          { silent: false }
        );
        fetchAPIData(response.api).once(
          async apiData => {
            const tabular = formatForTable(nlgResponse, apiData);
            await instance.messaging.removeMessages([statusMessageId]);
            if (tabular.output?.generic?.[1]?.user_defined?.rows?.length == 0) {
              sendTextMessage(nlgResponse, t('in-events:aichat.noMatching'), true);
            } else {
              instance.messaging.addMessage(tabular);

              setTimeout(() => {
                instance.messaging.addMessage({
                  output: {
                    generic: reprompt
                  }
                });
              }, 500);
            }
            await instance.updateCSSVariables({ 'BASE-width': '700px' });
          },
          //Public api call error
          apiError => {
            instance.messaging.removeMessages([statusMessageId]);
            sendError(nlgResponse, apiError);
          }
        );
      },
      // Query error
      error => {
        instance.messaging.removeMessages([loadingMessageId]);
        const msg = error.toString ? error.toString() : JSON.stringify(error);
        if (msg.includes('HttpRequestTimeoutError')) {
          sendError('', t('in-events:aichat.problemError'));
        } else {
          sendError('', msg);
        }
      }
    );
  } else if (request.input.text === '') {
    // First render
    if (!automationActionAiGenerationUnitEnabled) {
      // Needs AI consent response
      instance.messaging.addMessage({
        output: {
          generic: AIConsentPrompt
        }
      });
    } else {
      // Welcome message
      instance.messaging.addMessage({
        output: {
          generic: InitialLoadOptions
        }
      });
    }
  } else {
    handleDefinedTreeQuestions(request, instance, instance.trackCta);
  }
}
