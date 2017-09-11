import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getAgentNotifications } from 'in-stores/agentNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue() {
        return '';
      }
    }
  }
];

export default connectTo(
  {
    agentNotifications: getAgentNotifications()
  },
  function AgentViewAgentsTable({ agentNotifications }) {
    if (!agentNotifications) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = [];
    return (
      <DashboardTile title={`Agent Notifications (${agentNotifications.size})`}>
        <Table maxItemsPerPage={10} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
      </DashboardTile>
    );
  }
);

function getRowDetails() {
  return (
    <div>
      foobar
    </div>
  );
}
