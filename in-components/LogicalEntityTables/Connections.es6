import {combineLatest} from 'reactive-observables';
import React from 'react';

import DefaultConnectionCharts from
  'in-sdk/components/dashboard/DefaultLogicalConnectionDashboard/DefaultConnectionCharts';
import LogicalConnectionEntityTable from 'in-components/LogicalEntityTables/LogicalConnectionEntityTable';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {viewStructure} from 'in-stores/view';


export default function Connections({snapshotId, timeframe}) {

  return (
    <div>
      <LogicalConnectionEntityTable timeframe={timeframe}
                          title={'Inbound Connections'}
                          dataStream={viewStructure.flatMap(root => {
                                        for (let i = 0, length = root.children.length; i < length; i++) {
                                          const item = root.children[i];
                                          if (item.id === snapshotId) {
                                            return getUpstreamSnapshotsObservables(item);
                                          }
                                        }
                                        return alwaysNull;
                                     })
                                   }
                          createDetails={createDetails} />
      <LogicalConnectionEntityTable timeframe={timeframe}
                          title={'Outbound Connections'}
                          dataStream={viewStructure.flatMap(root => {
                                        for (let i = 0, length = root.children.length; i < length; i++) {
                                          const item = root.children[i];
                                          if (item.id === snapshotId) {
                                            return getDownstreamSnapshotsObservables(item);
                                          }
                                        }
                                        return alwaysNull;
                                     })
                                   }
                          createDetails={createDetails} />
    </div>
  );
}

function createDetails(nodeSnapshot, index, context) {
  return (
    <DefaultConnectionCharts snapshot={nodeSnapshot}
                             timeframe={context.timeframe} />
  );
}


function getDownstreamSnapshotsObservables(entity) {
  return combineLatest(entity.outgoingConnections.map(c => getSnapshot(c.id)));
}

function getUpstreamSnapshotsObservables(entity) {
  return combineLatest(entity.incomingConnections.map(c => getSnapshot(c.id)));
}
