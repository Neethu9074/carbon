import React from 'react';

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
    return <Table maxItemsPerPage={20} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
  }
);

function getRowDetails() {
  return (
    <div>
      foobar
    </div>
  );
}
