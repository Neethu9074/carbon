import React from 'react';

import {msZeroDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import {yesOrNo} from 'in-services/formatters/boolean';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function DatasourcesTable({snapshot, timeframe}) {
  const datasources = snapshot.getIn(['data', 'datasources.snapshot'], emptyMap);

  if (datasources.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Datasource Connection Pools'>
      <ExpandableTable data={datasources}
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


function getKey(datasourceSnapshot, datasourceName) {
  return datasourceName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Datasource JNDI Name</th>
        <th>Active Connections</th>
        <th>Available Connections</th>
        <th>Connections Currently In Use</th>
        <th>Time Waited for Exclusive Lock on Pool</th>
        <th>Statistics Enabled</th>
      </tr>
    </thead>
  );
}


function createRow(datasourceSnapshot, datasourceName, context) {
  return ([
    <td>{datasourceName}</td>,
    <Mtd metric={'datasources.metrics.' + datasourceName + '.active'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.metrics.' + datasourceName + '.available'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.metrics.' + datasourceName + '.inUse'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'datasources.metrics.' + datasourceName + '.blockingTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <td>{yesOrNo(datasourceSnapshot.get('statisticsEnabled'))}</td>
  ]);
}


function createDetails(datasourceSnapshot, datasourceName, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               formatter: zeroDecimalPlaces,
               metrics: [
                 'datasources.metrics.' + datasourceName + '.active',
                 'datasources.metrics.' + datasourceName + '.available',
                 'datasources.metrics.' + datasourceName + '.inUse',
                 'datasources.metrics.' + datasourceName + '.created',
                 'datasources.metrics.' + datasourceName + '.timedOut'
               ],
               labels: [
                 'Active Connections',
                 'Available Connections',
                 'Connections Currently In Use',
                 'Created Connections',
                 'Timed Out Connections'
               ],
               type: 'line'
             }} />
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
             timeframe={context.timeframe}
             margins={{
               left: 80
             }}
             y1={{
               formatter: msZeroDecimalPlaces,
               metrics: [
                 'datasources.metrics.' + datasourceName + '.blockingTime',
                 'datasources.metrics.' + datasourceName + '.creationTime'
               ],
               labels: [
                 'Time Waited for Exclusive Lock on Pool',
                 'Time Spent on Creating Connections'
               ],
               type: 'line'
             }} />
    </div>
  );
}
