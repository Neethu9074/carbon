import React from 'react';

import {msZeroDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function ConnectorsTable({snapshot, timeframe}) {
  const connectors = snapshot.getIn(['data', 'connectors'], emptyList);

  if (connectors.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Connectors'>
      <ExpandableTable data={connectors}
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


function getKey(indexName) {
  return indexName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Connector</th>
        <th>Average Response Time</th>
        <th>Requests</th>
        <th>Errors</th>
      </tr>
    </thead>
  );
}


function createRow(connectorName, i, context) {
  return ([
    <td>{connectorName}</td>,

    <Mtd metric={'connectors.' + connectorName + '.avgResponseTime'}
         formatter={msZeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectors.' + connectorName + '.requests'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectors.' + connectorName + '.errors'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}


function createDetails(connectorName, i, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80
           }}
           y1={{
             formatter: msZeroDecimalPlaces,
             metrics: [
               'connectors.' + connectorName + '.avgResponseTime'
             ],
             labels: [
               'Average Response Time'
             ],
             type: 'line'
           }}
           y2={{
             formatter: zeroDecimalPlaces,
             metrics: [
               'connectors.' + connectorName + '.requests',
               'connectors.' + connectorName + '.errors'
             ],
             labels: [
               'Requests',
               'Errors'
             ],
             type: 'line'
           }} />
  );
}
