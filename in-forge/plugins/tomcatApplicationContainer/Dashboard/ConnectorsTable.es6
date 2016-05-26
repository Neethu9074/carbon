import React from 'react';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function ConnectorsTable({snapshot, timeframe}) {
  const connectors = snapshot.getIn(['data', 'connector-config'], emptyMap);

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


function getKey(connector, connectorName) {
  return connectorName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Connector</th>
        <th>Threads</th>
        <th>Busy</th>
        <th>Max</th>
        <th>Connections</th>
        <th>Max</th>
      </tr>
    </thead>
  );
}


function createRow(connector, name, context) {
  return ([
    <td>{name}</td>,
    <Mtd metric={'connectors.' + name + '.threads'}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectors.' + name + '.threadsBusy'}
         snapshot={context.snapshot} />,
    <td>{connector.getIn(['threads', 'max'])}</td>,
    <Mtd metric={'connectors.' + name + '.connections'}
         snapshot={context.snapshot} />,
    <td>{connector.getIn(['connections', 'max'])}</td>
  ]);
}


function createDetails(connector, name, context) {
  return (
    <ChartWithLegend snapshot={context.snapshot}
           timeframe={context.timeframe}
           height={200}
           margins={{
             left: 80
           }}
           y1={{
             metrics: [
               'connectors.' + name + '.threads',
               'connectors.' + name + '.threadsBusy',
               'connectors.' + name + '.connections'
             ],
             labels: [
               name + ' Threads',
               name + ' Threads Busy',
               name + ' Connections'
             ],
             type: 'line'
           }}/>
  );
}
