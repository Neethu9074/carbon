import {combineLatest} from 'reactive-observables';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {getSnapshot, getRunningComponents} from 'in-stores/snapshot';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ExpandableTable from 'in-components/ExpandableTable';
import {getClusterMembers} from 'in-stores/clusterMembers';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import {alwaysNull} from 'in-services/fixedStreams';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    clusterNodes: getClusterMembers(props.snapshotId)
                    .flatMap(snapshotIds => {
                      return combineLatest(snapshotIds.toArray().map(snapshotId => {
                        return getRunningComponents(snapshotId)
                                 .flatMap(ids => {
                                    return (ids && ids.size > 0)
                                      ? getSnapshot(ids.toArray()[0]).startWith(null)
                                      : alwaysNull;
                                  });
                      }));
                    })
                    .throttle(1000)
  };
},
function HostsTable({clusterNodes, timeframe}) {
  if (clusterNodes == null || clusterNodes.length === 0) {
    return null;
  }

  return (
    <DashboardSection title='Hosts'>
      <ExpandableTable data={clusterNodes}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         timeframe
                       }} />
    </DashboardSection>
  );
});


function getKey(node) {
  return node.get('id');
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Health</th>
        <th>Name</th>
      </tr>
    </thead>
  );
}


function createRow(snapshot) {
  const id = snapshot.get('id');

  return [
    <td><AnnotatedHealthBar snapshotId={id} /></td>,
    <td>
      <SnapshotLink snapshotId={id}>
        {getLabel(snapshot)}
      </SnapshotLink>
    </td>
  ];
}
