/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { uniqueId } from 'lodash';

import {
  EVENT_AI_CHAT_APIEVENT_RESULT_POSITIVE,
  EVENT_AI_CHAT_APIEVENT_RESULT_NEGATIVE,
  EVENT_AI_CHAT_APICHAT_RESULT_POSITIVE,
  EVENT_AI_CHAT_APICHAT_RESULT_NEGATIVE,
  EVENT_AI_CHAT_API_ERROR_POSITIVE,
  EVENT_AI_CHAT_API_ERROR_NEGATIVE
} from 'in-services/tracking/eventNames';
import {
  handleDefinedTreeQuestions,
  InitialLoadOptions,
  RePromptObject,
  ThumbsFeedbackObject,
  NLGResponseObject
} from 'in-events/components/AIChat/ResponseObjects';
import {
  sendAPIQuery,
  fetchAPIData,
  formatForTable,
  fetchEventsData,
  formatForEventsTable
} from 'in-events/components/AIChat/chatAPI';
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
  // Always show the assistant input field since the feature flag is removed
  instance.updateAssistantInputFieldVisibility(true);
  async function sendError(nlg, errorMessage) {
    await instance.messaging.addMessage(
      {
        output: {
          generic: [
            ...(nlg ? [NLGResponseObject(nlg)] : []),
            {
              agent_message_type: 'inline_error',
              response_type: 'text',
              text: errorMessage
            },
            ThumbsFeedbackObject(EVENT_AI_CHAT_API_ERROR_POSITIVE, EVENT_AI_CHAT_API_ERROR_NEGATIVE)
          ]
        }
      },
      { silent: false, disableFadeAnimation: true }
    );

    await setTimeout(
      () =>
        instance.messaging.addMessage(
          {
            output: {
              generic: [RePromptObject]
            }
          },
          { silent: false, disableFadeAnimation: true }
        ),
      500
    );
  }

  async function showTableData(nlgResponse, apiData, statusMessageId, isEvents) {
    const tabular = isEvents ? formatForEventsTable(nlgResponse, apiData) : formatForTable(nlgResponse, apiData);
    await instance.messaging.removeMessages([statusMessageId]);
    if (tabular.output?.generic?.[1]?.user_defined?.rows?.length == 0) {
      const posTrack = (isEvents && EVENT_AI_CHAT_APIEVENT_RESULT_POSITIVE) || EVENT_AI_CHAT_APICHAT_RESULT_POSITIVE;
      const negTrack = (isEvents && EVENT_AI_CHAT_APIEVENT_RESULT_NEGATIVE) || EVENT_AI_CHAT_APICHAT_RESULT_NEGATIVE;
      await instance.messaging.addMessage(
        {
          output: {
            generic: [
              NLGResponseObject(nlgResponse),
              {
                response_type: 'text',
                text: t('in-events:aichat.noMatching')
              },
              ThumbsFeedbackObject(posTrack, negTrack),
              RePromptObject
            ]
          }
        },
        { silent: false, disableFadeAnimation: true }
      );
    } else {
      instance.messaging.addMessage(tabular, { disableFadeAnimation: true });
      await instance.updateCSSVariables({ 'BASE-width': '700px' });

      setTimeout(() => {
        instance.messaging.addMessage(
          {
            output: {
              generic: [RePromptObject]
            }
          },
          { disableFadeAnimation: true }
        );
      }, 500);
    }
  }

  // If the input message is valid and not blank we will want to make an API call
  const userQuery = request.input.text;
  if (userQuery !== undefined && userQuery !== '') {
    // Feature flag removed, always proceed with the query

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
      queryResponse => {
        instance.messaging.removeMessages([loadingMessageId]);
        const nlgResponse = queryResponse?.api?.NLG;
        const publicEndpoint = queryResponse?.api?.api_endpoint;

        if (!queryResponse) {
          sendError(nlgResponse, t('in-events:aichat.noData'));
          return;
        }
        if (queryResponse.error) {
          sendError(nlgResponse, queryResponse.error);
          return;
        }
        if (queryResponse.api?.error) {
          sendError(nlgResponse, queryResponse.api.error);
          return;
        }
        if (!publicEndpoint) {
          sendError(nlgResponse, t('in-events:aichat.unableToFindError'));
          return;
        }
        const statusMessageId = uniqueId('aichat_');
        instance.messaging.addMessage(
          {
            id: statusMessageId,
            output: {
              generic: [
                NLGResponseObject(nlgResponse),
                {
                  response_type: 'text',
                  text: t('in-events:aichat.findingInfoFrom', { endpoint: queryResponse.api.api_endpoint })
                },
                {
                  response_type: 'stream_loading'
                }
              ]
            }
          },
          { silent: false }
        );
        fetchAPIData(queryResponse?.api).once(
          async publicApiData => {
            //if its an events call, make an extra api call before displying response
            if (publicEndpoint === '/api/events') {
              //events response is very large so temporarily using subset till backend can support large payloads
              const publicApiDataSubset = publicApiData.slice(0, 2000);
              fetchEventsData(publicApiDataSubset, queryResponse.api).once(
                eventApiData => {
                  showTableData(nlgResponse, eventApiData, statusMessageId, true);
                },
                eventApiError => {
                  instance.messaging.removeMessages([statusMessageId]);
                  sendError(nlgResponse, eventApiError);
                }
              );
            } else {
              showTableData(nlgResponse, publicApiData, statusMessageId, false);
            }
          },
          publicApiError => {
            instance.messaging.removeMessages([statusMessageId]);
            sendError(nlgResponse, publicApiError);
          }
        );
      },
      // Query error
      queryError => {
        instance.messaging.removeMessages([loadingMessageId]);
        const msg = queryError.toString ? queryError.toString() : JSON.stringify(queryError);
        if (msg.includes('HttpRequestTimeoutError')) {
          sendError('', t('in-events:aichat.problemError'));
        } else {
          sendError('', msg);
        }
      }
    );
  } else if (request.input.text === '') {
    // First render
    // Feature flag removed, always show welcome message
    instance.messaging.addMessage({
      output: {
        generic: InitialLoadOptions
      }
    });
  } else {
    handleDefinedTreeQuestions(request, instance);
  }
}
