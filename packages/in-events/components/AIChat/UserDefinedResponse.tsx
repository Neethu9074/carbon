/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import PromptLibraryResponse from 'in-events/components/AIChat/CustomResponse/PromptLibraryResponse';
import TableChartSwitcher from 'in-events/components/AIChat/TableComponents/TableChartSwitcher';
import MarkdownResponse from 'in-events/components/AIChat/CustomResponse/MarkdownResponse';
import TypeTextResponse from 'in-events/components/AIChat/CustomResponse/TypeTextResponse';
import OptionsResponse from 'in-events/components/AIChat/CustomResponse/OptionsResponse';
import ThumbsFeedback from 'in-events/components/AIChat/CustomResponse/ThumbsFeedback';
import EventsTable from 'in-events/components/AIChat/TableComponents/EventsTable';

interface UserDefinedResponseProps {
  messageItem: any;
  instance: any;
  customResponseDefinitions?: CustomResponseDefinition[];
}
type Cases = { [key: string]: () => JSX.Element };
export type CustomResponseDefinition = {
  key: string;
  handler: () => JSX.Element;
};

// Little function that handles each of the cases accordingly
const handleCases = (key: string, cases: any) => {
  const handler = cases[key];
  if (handler) {
    return handler();
  } else {
    return null;
  }
};

/**
 * Renders a user-defined response based on its type
 * @param {Object} props - Component props
 * @param {Object} props.messageItem - The message item to render
 * @param {Object} props.instance - The chat instance
 * @param {Object} props.customResponseDefinitions - The customResponseDefinitions
 * @returns {React.ReactElement | null} The rendered response
 */
const UserDefinedResponse: React.FC<UserDefinedResponseProps> = ({
  messageItem,
  instance,
  customResponseDefinitions
}) => {
  if (!messageItem) {
    return null;
  }

  // These CASES are the default cases they are available to anyone using this AI Chat
  // Additional cases can be added here manually with associated keys and entries
  // OR the user can dynamically pass in additional cases if they dont want to be
  // managed in this file.
  const cases: Cases = {
    prompt_library: () => <PromptLibraryResponse instance={instance} />,
    option_buttons: () => <OptionsResponse messageItem={messageItem} instance={instance} />,
    table_chart: () => <TableChartSwitcher messageItem={messageItem} />,
    typetext_response: () => <TypeTextResponse messageItem={messageItem} />,
    markdown_response: () => <MarkdownResponse messageItem={messageItem} />,
    events_table: () => <EventsTable messageItem={messageItem} />,
    thumbs_feedback: () => (
      <ThumbsFeedback
        TRACKING_EVENT_POS={messageItem.user_defined.posTrack}
        TRACKING_EVENT_NEG={messageItem.user_defined.negTrack}
        additionalInfo={messageItem.user_defined.additionalInfo}
      />
    )
  };

  customResponseDefinitions &&
    customResponseDefinitions.forEach(({ key, handler }) => {
      cases[key] = handler;
    });

  return handleCases(messageItem.user_defined?.user_defined_type, cases);
};

export default UserDefinedResponse;
