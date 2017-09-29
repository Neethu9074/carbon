import React from 'react';

import AgentsTable from 'in-views/agentView/components/AgentsTable';
import AgentBaseView from 'in-views/agentView/AgentBaseView';

export default function AgentView() {
  return <AgentBaseView View={AgentsTable} />;
}
