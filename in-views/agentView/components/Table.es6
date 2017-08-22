import React from 'react';

import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './Table.less';

// const block = 'in-agent-view-table';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  }
];

export default connectTo(
  {
    agents: getSnapshotsInTimeframe('entity.selfType:agent')
  },
  function AgentViewTable({ agents }) {
    if (!agents) {
      return <LoadingIndicator type="dark" />;
    }

    const rows = agents.map(snapshotId => {
      return {
        key: snapshotId,
        snapshotId
      };
    });

    return <Table maxItemsPerPage={20} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
  }
);

function getRowDetails() {
  return (
    <div>
      hallo
    </div>
  );
}
