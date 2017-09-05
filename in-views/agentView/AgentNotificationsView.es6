import React from 'react';

import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentBaseView from 'in-views/agentView/AgentBaseView';

export default function AgentNotificationsView() {
  return <AgentBaseView View={AgentNotificationsTable} />;
}
