import { combineLatest } from 'reactive-observables';
import React from 'react';

import DefaultConnectionCharts from 'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultConnectionCharts';
import LogicalConnectionEntityTable from 'in-components/LogicalEntityTables/LogicalConnectionEntityTable';
import { logicalViewStructure$ } from 'in-stores/view';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';

export default function Connections({ snapshotId, timeConfig }) {
  return (
    <div>
      <LogicalConnectionEntityTable
        timeConfig={timeConfig}
        title={'Inbound Connections'}
        dataStream={logicalViewStructure$.flatMap(root => {
          for (let i = 0, length = root.children.length; i < length; i++) {
            const item = root.children[i];
            if (item.id === snapshotId) {
              return getUpstreamSnapshotsObservables(item);
            }
          }
          return alwaysNull;
        })}
        getRowDetails={getRowDetails}
      />
      <LogicalConnectionEntityTable
        timeConfig={timeConfig}
        title={'Outbound Connections'}
        dataStream={logicalViewStructure$.flatMap(root => {
          for (let i = 0, length = root.children.length; i < length; i++) {
            const item = root.children[i];
            if (item.id === snapshotId) {
              return getDownstreamSnapshotsObservables(item);
            }
          }
          return alwaysNull;
        })}
        getRowDetails={getRowDetails}
      />
    </div>
  );
}

function getRowDetails(row) {
  return <DefaultConnectionCharts snapshot={row.node} timeConfig={row.timeConfig} />;
}

function getDownstreamSnapshotsObservables(entity) {
  return combineLatest(entity.outgoingConnections.map(c => getSnapshot(c.id)));
}

function getUpstreamSnapshotsObservables(entity) {
  return combineLatest(entity.incomingConnections.map(c => getSnapshot(c.id)));
}
