import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';

import {
  noDataDecimalFormatter,
  noDataBytesFormatter
} from 'in-forge/plugins/cloudFoundry/Dashboard/Content';

export default function DopplerTable({snapshot, timeframe}) {
 const dopplerComponents = ['statistics', 'memory'];

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
        <th>Component</th>
      </tr>
    </thead>
  );
}

function createRow(componentId) {
  return ([
    <td>{componentId}</td>
  ]);
}

function createDetails(componentId, i, context) {
  if (componentId === 'statistics') {
    return statisticsCharts(context);
  } else if (componentId === 'memory') {
    return memoryCharts(context);
  }
}

function statisticsCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
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
  );
}

function memoryCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
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
  );
}
