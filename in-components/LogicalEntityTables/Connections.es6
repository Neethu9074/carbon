import {combineLatest} from 'reactive-observables';
import React from 'react';

import LogicalEntityTable from 'in-components/LogicalEntityTables/LogicalEntityTable';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {viewStructure} from 'in-stores/view';


export default function Connections({snapshotId, timeframe}) {

  return (
    <LogicalEntityTable timeframe={timeframe}
                        title={'Connected to'}
                        dataStream={viewStructure.flatMap(root => {
                                      for (let i = 0, length = root.get('children').size; i < length; i++) {
                                        const item = root.getIn(['children', i]);
                                        if (item.get('id') === snapshotId) {
                                          return getSnapshotsObservables(item);
                                        }
                                      }
                                      return alwaysNull;
                                   })
                                 } />
  );
}

function getSnapshotsObservables(entity) {
  const ids = [];
  entity.get('outgoingConnections').forEach(c => ids.push(c.get('id')));
  entity.get('incomingConnections').forEach(c => ids.push(c.get('id')));

  return combineLatest(ids.map(id => getSnapshot(id)));
}
