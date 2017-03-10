import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

import {
  noDataDecimalFormatter,
  noDataBytesFormatter
} from 'in-forge/plugins/cloudFoundry/Dashboard/Content';

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
         formatter={noDataDecimalFormatter} />,
    <Mtd metric={'doppler.total_dropped_msg'}
        snapshot={context.snapshot}
        formatter={noDataDecimalFormatter} />,
    <Mtd metric={'doppler.bytes_allocated'}
        snapshot={context.snapshot}
        formatter={noDataBytesFormatter} />,
    <Mtd metric={'doppler.bytes_allocated_heap'}
        snapshot={context.snapshot}
        formatter={noDataBytesFormatter} />,
    <Mtd metric={'doppler.bytes_allocated_stack'}
        snapshot={context.snapshot}
        formatter={noDataBytesFormatter} />
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
                 formatter: noDataDecimalFormatter,
                 tooltipFormatter: noDataDecimalFormatter,
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
                 formatter: noDataBytesFormatter,
                 tooltipFormatter: noDataBytesFormatter,
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
