import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

import {
  zeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

export default function DEATable({snapshot, timeframe}) {
 const deaComponents = [''];

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
        <th>Available disk ratio</th>
        <th>Available memory ratio</th>
        <th>Born</th>
        <th>Crashed</th>
        <th>Evacuating</th>
        <th>Running</th>
        <th>Starting</th>
        <th>Stopped</th>
      </tr>
    </thead>
  );
}

function createRow(componentId, i, context) {
  return ([
    <Mtd metric={'dea.dea_available_disk_ratio'}
         snapshot={context.snapshot}
         formatter={percentageTwoDecimalPlaces} />,
    <Mtd metric={'dea.dea_available_memory_ratio'}
        snapshot={context.snapshot}
        formatter={percentageTwoDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_born'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_crashed'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_evacuating'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_running'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_starting'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />,
    <Mtd metric={'dea.dea_registry_stopped'}
        snapshot={context.snapshot}
        formatter={zeroDecimalPlaces} />
  ]);
}

function createDetails(componentId, i, context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <div>
      <DashboardSection title='Resources'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={context.timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: percentageTwoDecimalPlaces,
                 tooltipFormatter: percentageTwoDecimalPlaces,
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
      <DashboardSection title='Registry'>
        <ChartWithLegend snapshotId={snapshotId}
               timeframe={context.timeframe}
               margins={{
                 left: 60
               }}
               y1={{
                 formatter: zeroDecimalPlaces,
                 tooltipFormatter: zeroDecimalPlaces,
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
    </div>
  );
}
