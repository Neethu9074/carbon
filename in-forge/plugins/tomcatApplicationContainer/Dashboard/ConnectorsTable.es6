import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function ConnectorsTable({snapshot, timeframe}) {
  const connectors = snapshot.getIn(['data', 'connector-config'], emptyMap)
                           .filter((c) => !c.get('executor'));
  if (connectors.size === 0) {
    return null;
  }

  if (connectors.first().get('connections')) {
    return (
      <DashboardSection title='Connectors'>
        <ExpandableTable data={connectors}
                         getKey={getKey}
                         createHeader={createHeaderWithConnections}
                         createRow={createRowWithConnections}
                         context={{
                           snapshot,
                           timeframe
                         }}
                         createDetails={createDetailsWithConnections} />
      </DashboardSection>
    );
  }
  // Tomcat 6 which does not have connection
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

function createHeaderWithConnections() {
  return (
    <thead>
      <tr>
        <th />
        <th colSpan='3'>Threads</th>
        <th colSpan='2'>Connections</th>
      </tr>
      <tr>
        <th>Connector</th>
        <th>Current</th>
        <th>Busy</th>
        <th>Max</th>
        <th>Current</th>
        <th>Max</th>
      </tr>
    </thead>
  );
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th />
        <th colSpan='3'>Threads</th>
      </tr>
      <tr>
        <th>Connector</th>
        <th>Current</th>
        <th>Busy</th>
        <th>Max</th>
      </tr>
    </thead>
  );
}

function createRowWithConnections(connector, name, context) {
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

function createRow(connector, name, context) {
  return ([
    <td>{name}</td>,
    <Mtd metric={'connectors.' + name + '.threads'}
         snapshot={context.snapshot} />,
    <Mtd metric={'connectors.' + name + '.threadsBusy'}
         snapshot={context.snapshot} />,
    <td>{connector.getIn(['threads', 'max'])}</td>
  ]);
}

function createDetailsWithConnections(connector, name, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
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

function createDetails(connector, name, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80
           }}
           y1={{
             metrics: [
               'connectors.' + name + '.threads',
               'connectors.' + name + '.threadsBusy'
             ],
             labels: [
               name + ' Threads',
               name + ' Threads Busy'
             ],
             type: 'line'
           }}/>
  );
}
