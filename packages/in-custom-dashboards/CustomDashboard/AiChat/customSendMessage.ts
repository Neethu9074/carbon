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
} from '@carbon/ai-chat';

import { Observable, combineLatest, just } from '@instana/observables';

import {
  CommonInferredConfig,
  InferenceResponse,
  InferredTagSuggestions,
  IsLoadingCounterType,
  LlmResponse,
  SlotsResponse,
  UserDefinedType
} from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getAllSloConfigurations } from 'in-service-levels/api/sloConfiguration';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { inferSlots, promptSlots } from 'in-custom-dashboards/api';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { Response } from 'in-services/http/types';
import { hours } from 'in-services/time/time';

const RESTRICTION_TEXT: string =
  'Sorry, I can only handle widget creation on custom dashboards. Please use a more specific prompt.';

export async function customSendMessage(request: MessageRequest, _: CustomSendMessageOptions, instance: ChatInstance) {
  const userQuery = request.input.text;

  if (userQuery) {
    instance.updateIsTypingCounter(IsLoadingCounterType.INCREASE);

    inferSlots(userQuery).once(handleInferenceResult(instance), error =>
      handleError(formatErrorMessage(error), instance)
    );
  }
}

/**
 * Creates a handler function for the inference result
 */
function handleInferenceResult(instance: ChatInstance) {
  return (response: Response<InferenceResponse>) => {
    if (
      !response ||
      !response.body ||
      !response.body.llmResponse?.type ||
      response.body.llmResponse.type.toLowerCase().trim() === 'null' // this catches the case when the LLM responds with 'null' or sth similar
    ) {
      instance.updateIsTypingCounter(IsLoadingCounterType.DECREASE);
      sendRestrictionMessage(instance);
      return;
    }

    const llmResponse = response.body.llmResponse;

    if (response.status > 399) {
      handleError(`Something went wrong. Code: ${response.status}, Message: ${response.statusText}`, instance);
      return;
    }

    switch (llmResponse.type) {
      case 'TIME_SERIES':
      case 'bigNumber':
        handleGenericWidget(llmResponse, instance);
        break;
      case 'slo2':
        handleSloWidget(llmResponse, instance);
        break;
      default:
        sendRestrictionMessage(instance);
        break;
    }
  };
}

/**
 * Handles metrics-based widgets (TIME_SERIES and bigNumber)
 */
function handleGenericWidget(llmResponse: LlmResponse, instance: ChatInstance) {
  const filters = (llmResponse as CommonInferredConfig)?.filter;

  if (!filters) {
    sendRestrictionMessage(instance);
    return;
  }

  const filterKeys = Object.keys(filters);
  const subscription = combineLatest(getInferredTagSuggestions(filterKeys), true).subscribe(tagSuggestionsResult => {
    const suggestions = tagSuggestionsResult.map(s => s.suggestions);

    if (!suggestions.every(Array.isArray)) {
      // Some suggestions are still loading or invalid
      return;
    }

    const filterOptions = createFilterOptions(tagSuggestionsResult);
    processSlots(llmResponse, filterOptions, instance);
    subscription.dispose();
  });
}

/**
 * Creates filter options from tag suggestions for backend compatibility
 */
function createFilterOptions(tagSuggestionsResult: InferredTagSuggestions[]): Record<string, string[]> {
  return tagSuggestionsResult.reduce((options: Record<string, string[]>, suggestionObj) => {
    options[suggestionObj.tagName] = suggestionObj.suggestions as string[];
    return options;
  }, {});
}

/**
 * Handles SLO widget type
 */
function handleSloWidget(llmResponse: LlmResponse, instance: ChatInstance) {
  const subscription = getAllSloConfigurations({ page: 1, pageSize: 1000 }).subscribe(sloConfigsResult => {
    if (isLoading(sloConfigsResult) || hasError(sloConfigsResult)) {
      return;
    }

    const filterOptions = {
      items: sloConfigsResult.data?.items.map(item => ({ name: item.name, id: item.id })) ?? []
    };

    processSlots(llmResponse, filterOptions, instance);
    subscription.dispose();
  });
}

/**
 * Process slots with the LLM response and filter options
 */
function processSlots(llmResponse: LlmResponse, filterOptions: Record<string, any>, instance: ChatInstance) {
  promptSlots({ llmResponse, filterOptions }).once(
    result => handleSlotsResult(result, instance),
    error => handleError(formatErrorMessage(error), instance)
  );
}

/**
 * Format error message from various error types
 */
function formatErrorMessage(error: any): string {
  return error.toString ? error.toString() : JSON.stringify(error);
}

function handleError(errorMessage: string, instance: ChatInstance) {
  instance.updateIsTypingCounter(IsLoadingCounterType.DECREASE);
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
}

function sendRestrictionMessage(instance: ChatInstance) {
  instance.messaging.addMessage({
    id: crypto.randomUUID(),
    output: {
      generic: [{ response_type: MessageResponseTypes.TEXT, text: RESTRICTION_TEXT } as TextItem]
    }
  });
}

function handleSlotsResult(slotsResponse: SlotsResponse, instance: ChatInstance) {
  instance.updateIsTypingCounter(IsLoadingCounterType.DECREASE);

  if (!slotsResponse) {
    sendRestrictionMessage(instance);
    return;
  }

  const { inferredSlotConfig, possibleSlotConfig } = slotsResponse;

  // if widget type could not be inferred, we can assume that user didn't prompt anything meaningful
  if (inferredSlotConfig?.widgetType == null) {
    sendRestrictionMessage(instance);
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

function getInferredTagSuggestions(filterTags: string[]): Observable<InferredTagSuggestions>[] {
  return filterTags.reduce((suggestions: Observable<InferredTagSuggestions>[], tagName) => {
    tagName === 'call.erroneous'
      ? suggestions.push(just({ tagName, suggestions: ['true', 'false'] }))
      : suggestions.push(
          getTagSuggestions({
            entity: 'NOT_APPLICABLE',
            tagName,
            tagFilterExpression: EMPTY_EXPRESSION,
            filter: {
              timeConfig: { windowSize: hours.toMillis(24), autoRefresh: false },
              useLongTermDataOnly: false,
              includeInternalCalls: false,
              includeSyntheticCalls: false
            },
            requestingSecondaryKeySuggestions: false
          }).map(result => {
            if (isLoading(result)) {
              return { tagName, suggestions: pendingResult };
            }
            const tagSuggestions = result.data?.suggestions ?? [];
            return { tagName, suggestions: tagSuggestions };
          })
        );
    return suggestions;
  }, []);
}

// Made with Bob
