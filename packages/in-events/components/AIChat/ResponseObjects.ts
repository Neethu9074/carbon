/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { MessageResponseTypes, TextItem, UserDefinedItem } from '@carbon/ai-chat';

import { TableHeader, TableRow } from 'in-events/components/AIChat/TableComponents/useTableState';
import { AdditionalInfoObject } from 'in-events/components/AIChat/CustomResponse/ThumbsFeedback';
import { Option } from 'in-events/components/AIChat/CustomResponse/OptionsResponse';
import { t } from 'in-i18n';

export const USER_DEFINED_PROMPT_LIBRARY = 'prompt_library';
export const USER_DEFINED_OPTION_BUTTONS = 'option_buttons';
export const USER_DEFINED_THUMBS_FEEDBACK = 'thumbs_feedback';
export const USER_DEFINED_TYPE_TEXT_RESPONSE = 'typetext_response';
export const USER_DEFINED_MARKDOWN_RESPONSE = 'markdown_response';
export const USER_DEFINED_TABLE_CHART = 'table_chart';
export const USER_DEFINED_EVENTS_TABLE = 'events_table';

// PromptLibrary library prompt object definition
export const PromptLibraryBubbleObject: UserDefinedItem = {
  response_type: MessageResponseTypes.USER_DEFINED,
  user_defined: {
    user_defined_type: USER_DEFINED_PROMPT_LIBRARY
  }
};

export const InitialLoadOptions: (TextItem | UserDefinedItem)[] = [
  {
    response_type: MessageResponseTypes.TEXT,
    text: t('in-events:aichat.welcome')
  },
  PromptLibraryBubbleObject
];

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
      user_defined_type: USER_DEFINED_THUMBS_FEEDBACK,
      posTrack: positiveTacking,
      negTrack: negativeTracking,
      additionalInfo: additionalInfo
    }
  };
}

// NLG object definition taking in the nlg text response
export function TypeTextObject(text: string): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: USER_DEFINED_TYPE_TEXT_RESPONSE,
      text: text
    }
  };
}

// Markdown object definition taking in the nlg text response
export function MarkdownObject(markdown: string): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: USER_DEFINED_MARKDOWN_RESPONSE,
      text: markdown
    }
  };
}

// Options object definition taking in the nlg text response
export function OptionsButtonObject(options: Option[]): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: USER_DEFINED_OPTION_BUTTONS,
      options: options
    }
  };
}

// Table Chart object definition that takes in the headers and rows
export function TableChartObject(headers: TableHeader[], rows: TableRow[]): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: USER_DEFINED_TABLE_CHART,
      headers: headers,
      rows: rows
    }
  };
}

// Events Table object definition that takes in the headers and rows
export function EventsTableObject(headers: TableHeader[], rows: TableRow[]): UserDefinedItem {
  return {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: { user_defined_type: USER_DEFINED_EVENTS_TABLE, headers, rows }
  };
}
