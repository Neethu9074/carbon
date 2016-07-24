import React from 'react';

import {
  percentageZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    processes: getRawPayload(props.snapshotId, 'processes')
  };
}, function ProcessTopList({processes}) {
  if (!processes || processes.size === 0) {
    return null;
  }

  processes = processes.toArray().sort((a, b) => b.get('cpu') - a.get('cpu'));

  return (
    <DashboardSection title='Process Top List'>
      <ExpandableTable data={processes}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow} />
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
        <th>PID</th>
        <th>Process Name</th>
        <th>CPU</th>
        <th>Memory</th>
      </tr>
    </thead>
  );
}


function createRow(process) {
  return ([
    <td>{process.get('pid')}</td>,
    <td>{process.get('name')}</td>,
    <td>{percentageZeroDecimalPlaces(process.get('cpu'))}</td>,
    <td>{bytesTwoDecimalPlaces(process.get('memory'))}</td>
  ]);
}
