import React from 'react';

import RowDetails from 'in-views/agentView/components/RowDetails';
import LoadingIndicator from 'in-components/LoadingIndicator';
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

export default function AgentViewAgentsTable({ agentSnapshots }) {
  if (!agentSnapshots) {
    return <LoadingIndicator type="dark" />;
  }

  const rows = [];
  return <Table maxItemsPerPage={20} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
}

function getRowDetails(row) {
  return <RowDetails row={row} />;
}
