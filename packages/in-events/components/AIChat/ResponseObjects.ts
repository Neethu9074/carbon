/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { ChatInstance, MessageRequest, MessageResponseTypes, TextItem, UserDefinedItem } from '@instana/ai-chat';

import { TableHeader, TableRow } from 'in-events/components/AIChat/TableComponents/useTableState';
import { AdditionalInfoObject } from 'in-events/components/AIChat/CustomResponse/ThumbsFeedback';
import { t } from 'in-i18n';

// PromptLibrary library prompt object definition
export const PromptLibraryBubbleObject: UserDefinedItem = {
  response_type: MessageResponseTypes.USER_DEFINED,
  user_defined: {
    user_defined_type: 'prompt_library'
  }
};

export const InitialLoadOptions: (TextItem | UserDefinedItem)[] = [
  {
    response_type: MessageResponseTypes.TEXT,
    text: t('in-events:aichat.welcome')
  },
  PromptLibraryBubbleObject
];

export function handleDefinedTreeQuestions(request: MessageRequest, instance: ChatInstance) {
  switch (request.input.text) {
    default:
      instance.messaging.addMessage({
        output: {
          generic: InitialLoadOptions
        }
      });
  }
}

// RePromptObject text object definition
export const RePromptObject: TextItem = {
  response_type: MessageResponseTypes.TEXT,
  text: t('in-events:aichat.anyOtherQs')
};

// ThumbsFeedback object definition taking in the pos / neg tracking string
export function ThumbsFeedbackObject(
  positiveTacking: string,
  negativeTracking: string,
  additionalInfo: AdditionalInfoObject
): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: 'thumbs_feedback',
      posTrack: positiveTacking,
      negTrack: negativeTracking,
      additionalInfo: additionalInfo
    }
  };
}

// ThumbsFeedback object definition taking in the nlg text response
export function NLGResponseObject(nlgResponse: string): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: 'nlg_response',
      text: nlgResponse
    }
  };
}

// Table Chart object definition that takes in the headers and rows
export function TableChartObject(headers: TableHeader[], rows: TableRow[]): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: 'table_chart',
      headers: headers,
      rows: rows
    }
  };
}

// Events Table object definition that takes in the headers and rows
export function EventsTableObject(headers: TableHeader[], rows: TableRow[]): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: { user_defined_type: 'events_table', headers, rows }
  };
}
