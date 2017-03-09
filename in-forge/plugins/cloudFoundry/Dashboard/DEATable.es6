import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';

import {
  noDataDecimalFormatter,
  noDataPercentageFormatter
} from 'in-forge/plugins/cloudFoundry/Dashboard/Content';

export default function DEATable({snapshot, timeframe}) {
 const deaComponents = ['resources', 'registry'];

 return (
    <DashboardSection title='DEA'>
      <ExpandableTable data={deaComponents}
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
  if (componentId === 'resources') {
    return resourcesCharts(context);
  } else if (componentId === 'registry') {
    return registryCharts(context);
  }
}

function resourcesCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <DashboardSection title='Resources'>
      <ChartWithLegend snapshotId={snapshotId}
             timeframe={context.timeframe}
             margins={{
               left: 60
             }}
             y1={{
               formatter: noDataPercentageFormatter,
               tooltipFormatter: noDataPercentageFormatter,
               metrics: [
                 'dea.dea_available_disk_ratio',
                 'dea.dea_available_memory_ratio',
               ],
               labels: [
                 'Available disk ratio',
                 'Available memory ratio'
               ],
               type: 'line'
             }}/>
    </DashboardSection>
  );
}

function registryCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <DashboardSection title='Registry'>
      <ChartWithLegend snapshotId={snapshotId}
             timeframe={context.timeframe}
             margins={{
               left: 60
             }}
             y1={{
               formatter: noDataDecimalFormatter,
               tooltipFormatter: noDataDecimalFormatter,
               metrics: [
                 'dea.dea_registry_born',
                 'dea.dea_registry_crashed',
                 'dea.dea_registry_evacuating',
                 'dea.dea_registry_running',
                 'dea.dea_registry_starting',
                 'dea.dea_registry_stopped'
               ],
               labels: [
                 'Born',
                 'Crashed',
                 'Evacuating',
                 'Running',
                 'Starting',
                 'Stopped'
               ],
               type: 'line'
             }} />
    </DashboardSection>
  );
}
