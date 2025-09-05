/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  MessageResponseTypes,
  AgentMessageType,
  ChatInstance,
  MessageRequest,
  MessageResponse,
  TextItem,
  CustomSendMessageOptions
} from '@carbon/ai-chat';
import { uniqueId } from 'lodash';

import {
  EVENT_AI_CHAT_API_RESULT_POSITIVE,
  EVENT_AI_CHAT_API_RESULT_NEGATIVE,
  EVENT_AI_CHAT_API_ERROR_POSITIVE,
  EVENT_AI_CHAT_API_ERROR_NEGATIVE
} from 'in-services/tracking/eventNames';
import { RePromptObject, ThumbsFeedbackObject, TypeTextObject, InitialLoadOptions } from 'in-aichat/ResponseObjects';
import { formatForTable, formatForEventsTable } from 'in-aichat/TableComponents/TableFormatters';
import { sendAPIQuery, fetchAPIData, fetchEventsData } from 'in-aichat/api/eventsChatAPI';
import { AdditionalInfoObject } from 'in-aichat/CustomResponse/ThumbsFeedback';
import { sendAgentQuery } from 'in-aichat/api/eventsChatAPI';
import { t } from 'in-i18n';

/**
 * Format error message from various error types
 */
function formatErrorMessage(error: any): string {
  return error.toString ? error.toString() : JSON.stringify(error);
}

/**
 * Create feedback data object for thumbs feedback
 */
function createFeedbackData(queryResponse: any, userQuery: string, errorMessage?: string): AdditionalInfoObject {
  const data: AdditionalInfoObject = {
    nlgResponse: queryResponse?.api?.NLG || '',
    userQuery,
    apiEndpoint: queryResponse?.api?.api_endpoint || '-',
    technology: queryResponse?.technology || '-',
    type: queryResponse?.type || '-'
  };

  if (errorMessage) {
    data.errorMessage = errorMessage;
  }

  return data;
}

/**
 * Creates a loading message with the Events-specific format
 */
function StatusMessage(statusMessageId: string, nlgResponse: string, endpoint: string): MessageResponse {
  return {
    id: statusMessageId,
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.USER_DEFINED,
          user_defined: {
            user_defined_type: 'nlg_response',
            text: nlgResponse
          }
        },
        {
          response_type: MessageResponseTypes.TEXT,
          text: t('in-aichat:aichat.findingInfoFrom', { endpoint: endpoint })
        }
      ]
    }
  } as MessageResponse;
}

/**
 * Sends an error message to the user
 */
async function sendError(instance: ChatInstance, errorMessage: string, queryResponse: any, userQuery: string) {
  instance.updateIsLoadingCounter('decrease');
  const nlg = queryResponse?.api?.NLG || '';

  const message = {
    output: {
      generic: [
        ...(nlg ? [TypeTextObject(nlg)] : []),
        {
          agent_message_type: AgentMessageType.INLINE_ERROR,
          response_type: MessageResponseTypes.TEXT,
          text: errorMessage
        },
        ThumbsFeedbackObject(
          EVENT_AI_CHAT_API_ERROR_POSITIVE,
          EVENT_AI_CHAT_API_ERROR_NEGATIVE,
          createFeedbackData(queryResponse, userQuery, errorMessage)
        ),
        RePromptObject
      ]
    }
  };

  await instance.messaging.addMessage(message);

  // Additional decrease to ensure loading gets removed
  instance.updateIsLoadingCounter('decrease');
}

/**
 * Handles table data display from API responses
 */
async function handleTableData(
  instance: ChatInstance,
  apiData: any,
  statusMessageId: string,
  queryResponse: any,
  userQuery: string,
  isEvents: boolean
) {
  instance.updateIsLoadingCounter('decrease');
  const nlgResponse = queryResponse?.api?.NLG || '';

  // Format the data for table display
  const tabular = isEvents
    ? formatForEventsTable(apiData, userQuery, queryResponse)
    : formatForTable(apiData, userQuery, queryResponse);

  await instance.messaging.removeMessages([statusMessageId]);

  // Check if there are rows in the table data
  const rows = tabular.output?.generic?.[1]?.user_defined?.rows;
  const hasRows = Array.isArray(rows) && rows.length > 0;

  if (!hasRows) {
    // Show "no matching results" message
    const noMatchingMessage = {
      response_type: MessageResponseTypes.TEXT,
      text: t('in-aichat:aichat.noMatching')
    };

    const message = {
      output: {
        generic: [
          TypeTextObject(nlgResponse),
          noMatchingMessage,
          ThumbsFeedbackObject(
            EVENT_AI_CHAT_API_RESULT_POSITIVE,
            EVENT_AI_CHAT_API_RESULT_NEGATIVE,
            createFeedbackData(queryResponse, userQuery)
          ),
          RePromptObject
        ]
      }
    };

    await instance.messaging.addMessage(message);
  } else {
    if (tabular.output?.generic) {
      tabular.output.generic.push(RePromptObject);
    }

    instance.messaging.addMessage(tabular);
    await instance.updateCSSVariables({ 'BASE-width': '700px' });
  }

  // Additional decrease to match JS implementation
  instance.updateIsLoadingCounter('decrease');
}

/**
 * Process a user query using the traditional API flow
 */
function processTraditionalQuery(instance: ChatInstance, userQuery: string) {
  instance.updateIsLoadingCounter('increase');

  // Step 1: Send the initial query to get API endpoint info
  sendAPIQuery(userQuery).once(
    (queryResponse: any) => {
      const publicEndpoint = queryResponse?.api?.api_endpoint;

      // Step 2: Validate the response
      if (!queryResponse) {
        sendError(instance, t('in-aichat:aichat.noData'), queryResponse, userQuery);
        return;
      }

      if (queryResponse.error) {
        sendError(instance, queryResponse.error, queryResponse, userQuery);
        return;
      }

      if (queryResponse.api?.error) {
        sendError(instance, queryResponse.api.error, queryResponse, userQuery);
        return;
      }

      if (!queryResponse.api?.api_endpoint) {
        sendError(instance, t('in-aichat:aichat.unableToFindError'), queryResponse, userQuery);
        return;
      }

      // Step 3: Show status message
      const statusMessageId = uniqueId('aichat_');
      const nlgResponse = queryResponse?.api?.NLG || '';
      const endpoint = queryResponse.api?.api_endpoint || '';

      // Create and display loading message
      const statusMessage = StatusMessage(statusMessageId, nlgResponse, endpoint);
      instance.messaging.addMessage(statusMessage);

      // Step 4: Fetch API data
      fetchAPIData(queryResponse?.api).once(
        (publicApiData: any) => {
          // Step 5: Handle events data if needed
          if (publicEndpoint === '/api/events') {
            // Events response is very large so temporarily using subset
            const publicApiDataSubset = publicApiData.slice(0, 2000);

            fetchEventsData(publicApiDataSubset, queryResponse.api).once(
              (eventApiData: any) => {
                handleTableData(instance, eventApiData, statusMessageId, queryResponse, userQuery, true);
              },
              (eventApiError: any) => {
                instance.messaging.removeMessages([statusMessageId]);
                sendError(instance, formatErrorMessage(eventApiError), queryResponse, userQuery);
              }
            );
          } else {
            // Handle regular data
            handleTableData(instance, publicApiData, statusMessageId, queryResponse, userQuery, false);
          }
        },
        (publicApiError: any) => {
          instance.messaging.removeMessages([statusMessageId]);
          sendError(instance, formatErrorMessage(publicApiError), queryResponse, userQuery);
        }
      );
    },
    (queryError: any) => {
      const msg = formatErrorMessage(queryError);
      if (msg.includes('HttpRequestTimeoutError') || msg.includes('Request timed out')) {
        sendError(instance, t('in-aichat:aichat.problemError'), null, userQuery);
      } else {
        sendError(instance, msg, null, userQuery);
      }
    }
  );
}

/**
 * Process a user query using the agent API flow
 */
// TODO: This is skeleton code - update with changes to support agentic chat interface.
function processAgentQuery(instance: ChatInstance, userQuery: string) {
  instance.updateIsLoadingCounter('increase');

  // Step 1: Show status message
  const statusMessageId = uniqueId('aichat_');
  const statusMessage = {
    id: statusMessageId,
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.TEXT,
          text: t('in-aichat:aichat.findingInfo')
        } as TextItem
      ]
    }
  } as MessageResponse;

  instance.messaging.addMessage(statusMessage);

  // Step 2: Call the agent API using observables
  sendAgentQuery(userQuery).once(
    (response: any) => {
      // Step 3: Clean up and handle response
      instance.updateIsLoadingCounter('decrease');
      instance.messaging.removeMessages([statusMessageId]);

      if (response.error) {
        sendError(instance, response.error, null, userQuery);
        return;
      }

      // Step 4: Display the agent response
      const responseMessage = {
        output: {
          generic: [
            {
              response_type: MessageResponseTypes.USER_DEFINED,
              user_defined: {
                user_defined_type: 'agent-response',
                content: response.data
              }
            },
            RePromptObject
          ]
        }
      };

      instance.messaging.addMessage(responseMessage);
      instance.updateIsLoadingCounter('decrease');
    },
    (error: any) => {
      instance.messaging.removeMessages([statusMessageId]);
      sendError(instance, formatErrorMessage(error), null, userQuery);
    }
  );
}

// Feature flag for agentQuery API - will be replaced with real feature flag later
const useAgenticChat = false;

/**
 * Custom message handler for Events AI Chat
 * Processes user queries and displays appropriate responses
 */
export function EventsCustomSendMessages(request: MessageRequest, _: CustomSendMessageOptions, instance: ChatInstance) {
  // Always show the assistant input field
  instance.updateAssistantInputFieldVisibility(true);

  const userQuery = request?.input?.text || '';

  // If there's a query, process it; otherwise show welcome message
  if (userQuery !== '') {
    // Use different processing based on feature flag
    if (useAgenticChat) {
      processAgentQuery(instance, userQuery);
    } else {
      processTraditionalQuery(instance, userQuery);
    }
  } else if (userQuery === '') {
    // Show welcome message for empty queries
    instance.messaging.addMessage({
      output: {
        generic: InitialLoadOptions
      }
    });
  }
}
