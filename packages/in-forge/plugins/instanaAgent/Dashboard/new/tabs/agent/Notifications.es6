import React from 'react';

import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getAgentNotificationsForHost } from 'in-stores/agentNotification';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      agentNotifications: getAgentNotificationsForHost(props.snapshot)
    };
  },
  function Notifications({ agentNotifications }) {
    return (
      <MaxWidthFullscreenContainer>
        <AgentNotificationsTable agentNotifications={agentNotifications} />
      </MaxWidthFullscreenContainer>
    );
  }
);
