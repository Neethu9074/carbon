import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import ExpandableTable from 'in-components/ExpandableTable';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import {getSnapshots} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';


export default connectTo(props => {
  return {
    hosts: getHostsInAvailabilityZone(props.snapshotId)
      .flatMap(snapshotIds => getSnapshots(snapshotIds))
  };
},
function HostsTable({hosts, timeframe}) {
  if (hosts == null || hosts.length === 0) {
    return null;
  }

  return (
    <DashboardSection title='Hosts'>
      <ExpandableTable data={hosts}
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
        <th>CPU Usage</th>
        <th>Memory Usage</th>
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
    </td>,
    <Mtd metric={'cpu.used'}
         snapshot={snapshot}
         formatter={percentageZeroDecimalPlaces}/>,
    <Mtd metric={'memory.used'}
         snapshot={snapshot}
         formatter={percentageZeroDecimalPlaces}/>
  ];
}
