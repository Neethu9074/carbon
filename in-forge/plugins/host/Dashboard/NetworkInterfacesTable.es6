import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import {
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


export default function NetworkInterfacesTable({snapshot, timeframe}) {
  const interfaces = snapshot.getIn(['data', 'interfaces'], emptyList);

  return (
    <DashboardSection title='Network Interfaces'>
      <ExpandableTable data={interfaces}
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


function getKey(filesystem, name) {
  return name;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th colSpan='4'>Received (RX)</th>
        <th colSpan='4'>Transmitted (TX)</th>
      </tr>
      <tr>
        <th>Interface</th>
        <th>Mac</th>
        <th>IPs</th>

        <th style={{width: '10em'}}>Bytes</th>
        <th style={{width: '4em'}}>Errors</th>
        <th style={{width: '4em'}}>Dropped</th>
        <th style={{width: '4em'}}>Overruns</th>

        <th style={{width: '10em'}}>Bytes</th>
        <th style={{width: '4em'}}>Errors</th>
        <th style={{width: '4em'}}>Dropped</th>
        <th style={{width: '4em'}}>Overruns</th>
      </tr>
    </thead>
  );
}


function createRow(filesystem, name, context) {
  return ([
    <td>{name}</td>,

    <td>{filesystem.get('mac')}</td>,

    <td>{filesystem.get('addresses').map(address => address.get('ip')).join(', ')}</td>,

    <Mtd metric={'ifs.' + name + '.rx.bytes'}
         snapshot={context.snapshot}
         formatter={bytesPerSecondZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.rx.errors'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.rx.dropped'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.rx.overruns'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.tx.bytes'}
         snapshot={context.snapshot}
         formatter={bytesPerSecondZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.tx.errors'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.tx.dropped'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />,

    <Mtd metric={'ifs.' + name + '.tx.overruns'}
         snapshot={context.snapshot}
         formatter={percentageZeroDecimalPlaces} />
  ]);
}


function createDetails(filesystem, name, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80,
             right: 80
           }}

           y1={{
             min: 0,
             formatter: bytesZeroDecimalPlaces,
             tooltipFormatter: bytesTwoDecimalPlaces,
             metrics: [
               'ifs.' + name + '.rx.bytes',
               'ifs.' + name + '.tx.bytes'
             ],
             labels: [
               'Received/s',
               'Transmitted/s'
             ],
             type: 'line'
           }}
           y2={{
             min: 0,
             max: 1,
             metrics: [
               'ifs.' + name + '.rx.errors',
               'ifs.' + name + '.rx.dropped',
               'ifs.' + name + '.rx.overruns',
               'ifs.' + name + '.tx.errors',
               'ifs.' + name + '.tx.dropped',
               'ifs.' + name + '.tx.overruns'
             ],
             labels: [
               'RX Errors',
               'RX Dropped',
               'RX Overruns',
               'TX Errors',
               'TX Dropped',
               'TX Overruns'
             ],
             formatter: percentageZeroDecimalPlaces,
             tooltipFormatter: percentageTwoDecimalPlaces,
             type: 'line'
           }} />
  );
}
