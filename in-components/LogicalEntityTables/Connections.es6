import {combineLatest} from 'reactive-observables';
import React from 'react';

import LogicalEntityTable from 'in-components/LogicalEntityTables/LogicalEntityTable';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {viewStructure} from 'in-stores/view';


export default function Connections({snapshotId, timeframe}) {
  return (
    <LogicalEntityTable timeframe={timeframe}
                        dataStream={viewStructure.flatMap(root => {
                                      let stream = alwaysNull;
                                      for (let i = 0, length = root.get('children').size; i < length; i++) {
                                        const item = root.getIn(['children', i]);
                                        if (item.get('id') === snapshotId) {
                                          stream = combineLatest(item.get('outgoingConnections').toArray()
                                                   .concat(item.get('incomingConnections').toArray()))
                                                 .flatMap(getSnapshot);
                                        }
                                      }
                                      return stream;
                                   })
                                 } />
  );
}
