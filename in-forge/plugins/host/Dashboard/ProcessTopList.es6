import React from 'react';

import {
  percentageZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import getProcessSnapshotIdForPid from 'in-services/subscription/processSnapshotIdForPid';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import ExpandableTable from 'in-components/ExpandableTable';
import {getRawPayload} from 'in-stores/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    processes: getRawPayload(props.snapshot.get('id'), 'processes')
  };
}, function ProcessTopList({snapshot, processes}) {
  if (!processes || processes.size === 0) {
    return null;
  }

  processes = processes.toArray().sort((a, b) => b.get('cpu') - a.get('cpu'));

  return (
    <DashboardSection title='Process Top List'>
      <ExpandableTable data={processes}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot
                       }} />
    </DashboardSection>
  );
});


function getKey(process) {
  return process.get('pid');
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th width='90'>PID</th>
        <th>Process Name</th>
        <th width='100'>CPU</th>
        <th width='100'>Memory</th>
      </tr>
    </thead>
  );
}


function createRow(process, id, context) {
  return ([
    <td>{process.get('pid')}</td>,
    <PidNameColumn pid={process.get('pid')}
                   name={process.get('name')}
                   host={context.snapshot} />,
    <td>{percentageZeroDecimalPlaces(process.get('cpu'))}</td>,
    <td>{bytesTwoDecimalPlaces(process.get('memory'))}</td>
  ]);
}


const PidNameColumn = connectTo(props => {
  return {
    processSnapshot: getProcessSnapshotIdForPid({
      pid: props.pid,
      hostSnapshot: props.host
    })
    .flatMap(processSnapshotId => getSnapshot(processSnapshotId))
  };
}, function PidNameColumn({name, processSnapshot}) {
  if (processSnapshot) {
    return (
      <td>
        <HierarchicalLink snapshotId={processSnapshot.get('id')}
                          calculateHierarchy
                          kind='dark'>
          {getLabel(processSnapshot)}
        </HierarchicalLink>
      </td>
    );
  }

  return (
    <td>{name}</td>
  );
});
