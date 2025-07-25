/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import PromptLibraryResponse from 'in-events/components/AIChat/CustomResponse/PromptLibraryResponse';
// @ts-expect-error - No type definitions available
import NLGResponse from 'in-events/components/AIChat/CustomResponse/NLGResponse';
import TableChartSwitcher from 'in-events/components/AIChat/TableComponents/TableChartSwitcher';
import ThumbsFeedback from 'in-events/components/AIChat/CustomResponse/ThumbsFeedback';
import EventsTable from 'in-events/components/AIChat/TableComponents/EventsTable';

interface UserDefinedResponseProps {
  messageItem: any;
  instance: any;
}

/**
 * Renders a user-defined response based on its type
 * @param {Object} props - Component props
 * @param {Object} props.messageItem - The message item to render
 * @param {Object} props.instance - The chat instance
 * @returns {React.ReactElement | null} The rendered response
 */
const UserDefinedResponse: React.FC<UserDefinedResponseProps> = ({ messageItem, instance }) => {
  if (!messageItem) {
    return null;
  }

  const type = messageItem.user_defined?.user_defined_type;
  if (!type) {
    return null;
  }

  // Render based on message type
  switch (type) {
    case 'prompt_library':
      return <PromptLibraryResponse instance={instance} />;
    case 'table_chart':
      return <TableChartSwitcher messageItem={messageItem} />;
    case 'nlg_response':
      return <NLGResponse messageItem={messageItem} />;
    case 'events_table':
      return <EventsTable messageItem={messageItem} />;
    case 'thumbs_feedback':
      return (
        <ThumbsFeedback
          TRACKING_EVENT_POS={messageItem.user_defined.posTrack}
          TRACKING_EVENT_NEG={messageItem.user_defined.negTrack}
        />
      );
    default:
      return null;
  }
};

export default UserDefinedResponse;
