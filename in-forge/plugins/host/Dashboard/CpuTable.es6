import {Range} from 'immutable';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function CpuTable({snapshot, timeframe}) {
  const cpuCount = snapshot.getIn(['data', 'cpu.count'], 1);
  const cpus = Range(1, cpuCount + 1);

  if (cpuCount < 2) {
    return null;
  }

  return (
    <DashboardSection title='Individual CPU Usage'>
      <ExpandableTable data={cpus}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
    </DashboardSection>
  );
}


function getKey(cpuNo) {
  return cpuNo;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>CPU</th>
        <th>User</th>
        <th>System</th>
        <th>Wait</th>
        <th>Nice</th>
        <th>Steal</th>
      </tr>
    </thead>
  );
}


function createRow(cpuNo, index, context) {
  return ([
    <td>CPU {cpuNo}</td>,

    <Mtd metric={'cpus.' + cpuNo + '.user'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'cpus.' + cpuNo + '.sys'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'cpus.' + cpuNo + '.wait'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'cpus.' + cpuNo + '.nice'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'cpus.' + cpuNo + '.steal'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />
  ]);
}


function createDetails(cpuNo, index, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 60
           }}
           y1={{
             min: 0,
             max: 1,
             formatter: percentageZeroDecimalPlaces,
             metrics: [
               'cpus.' + cpuNo + '.user',
               'cpus.' + cpuNo + '.sys',
               'cpus.' + cpuNo + '.wait',
               'cpus.' + cpuNo + '.nice',
               'cpus.' + cpuNo + '.steal'
             ],
             labels: [
               'User',
               'System',
               'Wait',
               'Nice',
               'Steal'
             ],
             type: 'stackedArea'
           }} />
  );
}
