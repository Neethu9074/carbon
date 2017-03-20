import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

import {
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces
} from 'in-services/formatters/number';

export default function DopplerTable({snapshot, timeframe}) {
 const dopplerComponents = [''];

 return (
    <DashboardSection title='Doppler'>
      <ExpandableTable data={dopplerComponents}
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

function getKey(componentId) {
  return componentId;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Error received</th>
        <th>Dropped messages</th>
        <th>Allocated</th>
        <th>Allocated Heapt</th>
        <th>Allocated Stack</th>
      </tr>
    </thead>
  );
}

function createRow(componentId, i, context) {
  return ([
    <Mtd metric={'doppler.error_received'}
         snapshot={context.snapshot}
         formatter={zeroDecimalPlaces} />,
    <Mtd metric={'doppler.total_dropped_msg'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'doppler.bytes_allocated'}
        snapshot={context.snapshot}
        formatter={bytesZeroDecimalPlaces} />,
    <Mtd metric={'doppler.bytes_allocated_heap'}
        snapshot={context.snapshot}
        formatter={bytesZeroDecimalPlaces} />,
    <Mtd metric={'doppler.bytes_allocated_stack'}
        snapshot={context.snapshot}
        formatter={bytesZeroDecimalPlaces} />
  ]);
}

function createDetails(componentId, i, context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <div>
      <DashboardSection title='Statistics'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={context.timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: zeroDecimalPlaces,
                 tooltipFormatter: zeroDecimalPlaces,
                 metrics: [
                   'doppler.error_received',
                   'doppler.total_dropped_msg'
                 ],
                 labels: [
                   'Error received',
                   'Dropped messages'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
      <DashboardSection title='Memory'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={context.timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: bytesZeroDecimalPlaces,
                 tooltipFormatter: bytesZeroDecimalPlaces,
                 metrics: [
                   'doppler.bytes_allocated',
                   'doppler.bytes_allocated_heap',
                   'doppler.bytes_allocated_stack',
                 ],
                 labels: [
                   'Allocated',
                   'Allocated Heap',
                   'Allocated Stack'
                 ],
                 type: 'line'
               }} />
      </DashboardSection>
    </div>
  );
}
