import {combineLatest} from 'reactive-observables';
import React from 'react';

import LogicalEntityTable from 'in-components/LogicalEntityTables/LogicalEntityTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {getSnapshot} from 'in-stores/snapshot';


export default function ClusterNodes({snapshotId, timeframe}) {
  return (
    <LogicalEntityTable timeframe={timeframe}
                        title={'Runs on'}
                        dataStream={getClusterMembers(snapshotId)
                                    // Always start with an empty set to avoid inconsistent view,
                                    // displaying running components for a previously selected snapshot.
                                    .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))

                                    // throttle because of massive snapshot updates which would produce a rerender/call
                                    .throttle(1000)
                                  } />
  );
}
