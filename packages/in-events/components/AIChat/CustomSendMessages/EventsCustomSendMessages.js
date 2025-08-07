/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { uniqueId } from 'lodash';

import { MessageResponseTypes, AgentMessageType } from '@instana/ai-chat';

import {
  EVENT_AI_CHAT_API_RESULT_POSITIVE,
  EVENT_AI_CHAT_API_RESULT_NEGATIVE,
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
import { formatForTable, formatForEventsTable } from 'in-events/components/AIChat/TableComponents/TableFormatters';
import { sendAPIQuery, fetchAPIData, fetchEventsData } from 'in-events/components/AIChat/api/eventsChatAPI';
import { t } from 'in-i18n';

// Params:
// request of type MessageRequest
// requestOptions of type CustomSendMessageOptions
// instance of type ChatInstance
export async function EventsCustomSendMessages(
  request,
  // eslint-disable-next-line
  requestOptions,
  instance
) {
  // Always show the assistant input field since the feature flag is removed
  instance.updateAssistantInputFieldVisibility(true);
  async function sendError(errorMessage, queryResponse, userQuery) {
    const nlg = queryResponse?.api?.NLG || '';
    await instance.messaging.addMessage(
      {
        output: {
          generic: [
            ...(nlg ? [NLGResponseObject(nlg)] : []),
            {
              agent_message_type: AgentMessageType.INLINE_ERROR,
              response_type: MessageResponseTypes.TEXT,
              text: errorMessage
            },
            ThumbsFeedbackObject(EVENT_AI_CHAT_API_ERROR_POSITIVE, EVENT_AI_CHAT_API_ERROR_NEGATIVE, {
              errorMessage: errorMessage,
              nlgResponse: nlg,
              userQuery: userQuery,
              apiEndpoint: queryResponse?.api?.api_endpoint || '-',
              technology: queryResponse?.technology || '-',
              type: queryResponse?.type || '-'
            })
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

  async function showTableData(apiData, statusMessageId, queryResponse, userQuery, isEvents) {
    const nlgResponse = queryResponse?.api?.NLG || '';
    const tabular = isEvents
      ? formatForEventsTable(apiData, userQuery, queryResponse)
      : formatForTable(apiData, userQuery, queryResponse);

    await instance.messaging.removeMessages([statusMessageId]);
    if (tabular.output?.generic?.[1]?.user_defined?.rows?.length == 0) {
      await instance.messaging.addMessage(
        {
          output: {
            generic: [
              NLGResponseObject(nlgResponse),
              {
                response_type: MessageResponseTypes.TEXT,
                text: t('in-events:aichat.noMatching')
              },
              ThumbsFeedbackObject(EVENT_AI_CHAT_API_RESULT_POSITIVE, EVENT_AI_CHAT_API_RESULT_NEGATIVE, {
                nlgResponse: nlgResponse,
                userQuery: userQuery,
                apiEndpoint: queryResponse?.api?.api_endpoint || '-',
                technology: queryResponse.technology,
                type: queryResponse?.type || '-'
              }),
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
          sendError(t('in-events:aichat.noData'), queryResponse, userQuery);
          return;
        }
        if (queryResponse.error) {
          sendError(queryResponse.error, queryResponse, userQuery);
          return;
        }
        if (queryResponse.api?.error) {
          sendError(queryResponse.api.error, queryResponse, userQuery);
          return;
        }
        if (!publicEndpoint) {
          sendError(t('in-events:aichat.unableToFindError'), queryResponse, userQuery);
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
                  response_type: MessageResponseTypes.TEXT,
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
                  showTableData(eventApiData, statusMessageId, queryResponse, userQuery, true);
                },
                eventApiError => {
                  instance.messaging.removeMessages([statusMessageId]);
                  sendError(eventApiError, queryResponse, userQuery);
                }
              );
            } else {
              showTableData(publicApiData, statusMessageId, queryResponse, userQuery, false);
            }
          },
          publicApiError => {
            instance.messaging.removeMessages([statusMessageId]);
            sendError(publicApiError, queryResponse, userQuery);
          }
        );
      },
      // Query error
      queryError => {
        instance.messaging.removeMessages([loadingMessageId]);
        const msg = queryError.toString ? queryError.toString() : JSON.stringify(queryError);
        if (msg.includes('HttpRequestTimeoutError')) {
          sendError(t('in-events:aichat.problemError'), queryError, userQuery);
        } else {
          sendError(msg, queryError, userQuery);
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
